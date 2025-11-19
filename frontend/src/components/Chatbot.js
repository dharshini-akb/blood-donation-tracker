import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import io from 'socket.io-client';
import { chatAPI } from '../services/api';

const Chatbot = () => {
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Initialize socket connection (best-effort). Works even if socket is unavailable.
    const socketUrl = process.env.REACT_APP_SOCKET_URL
      || (process.env.REACT_APP_API_BASE_URL ? process.env.REACT_APP_API_BASE_URL.replace(/\/api$/, '') : '')
      || 'http://localhost:5001';
    const newSocket = io(socketUrl, { transports: ['websocket', 'polling'], autoConnect: true });
    setSocket(newSocket);

    // Connection event handlers
    newSocket.on('connect', () => {
      console.log('Connected to server');
      setIsConnected(true);
      
      // Join room based on user role
      if (user?.role) {
        newSocket.emit('join-room', user.role);
      }
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from server');
      setIsConnected(false);
    });

    // Message event handler
    newSocket.on('receive-message', (data) => {
      setMessages(prev => [...prev, data]);
    });

    return () => {
      try { newSocket.close(); } catch {}
    };
  }, [user?.role]);

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    // Always append the user's message locally first
    const userMessageObj = {
      message: newMessage.trim(),
      senderRole: user?.role || 'User',
      senderName: user?.name || 'You',
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, userMessageObj]);

    // Best-effort broadcast over socket when available
    if (socket && socket.connected) {
      try {
        socket.emit('send-message', {
          message: userMessageObj.message,
          senderRole: userMessageObj.senderRole,
          senderName: userMessageObj.senderName
        });
      } catch {}
    }

    // Always ask AI using full conversation context (last 12 messages)
    setIsThinking(true);
    const recent = [...messages, { role: 'user', content: newMessage.trim() }].slice(-12);
    const mapped = recent.map(m => {
      if (m.senderRole) {
        return { role: m.senderRole === user?.role ? 'user' : 'assistant', content: m.message };
      }
      return { role: m.role || 'user', content: m.content };
    });
    try {
      const base = (process.env.REACT_APP_API_BASE_URL || 'http://localhost:5001/api');
      const token = localStorage.getItem('token');
      const res = await fetch(`${base}/chat/stream`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ messages: mapped })
      });
      if (res.ok && res.body) {
        const reader = res.body.getReader();
        const decoder = new TextDecoder('utf-8');
        let assistantIndex = null;
        let buffer = '';
        const updateMessage = (content, index) => {
          setMessages(prev => {
            const arr = [...prev];
            const idx = arr.findIndex((m, i) => i === index);
            if (idx >= 0) {
              arr[idx] = { ...arr[idx], message: content };
            }
            return arr;
          });
        };
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value);
          if (assistantIndex === null) {
            assistantIndex = messages.length + 1;
            setMessages(prev => [...prev, {
              message: '',
              senderRole: 'Assistant',
              senderName: 'Assistant',
              timestamp: new Date().toISOString()
            }]);
          }
          const content = buffer;
          updateMessage(content, assistantIndex);
        }
      } else {
        const fallback = await chatAPI.ask(mapped);
        const aiReply = fallback.data?.reply || '';
        if (aiReply) {
          setMessages(prev => [...prev, {
            message: aiReply,
            senderRole: 'Assistant',
            senderName: 'Assistant',
            timestamp: new Date().toISOString()
          }]);
        }
      }
    } catch (err) {
      setMessages(prev => [...prev, {
        message: 'Sorry, I could not get a response right now. Please try again in a moment.',
        senderRole: 'Assistant',
        senderName: 'Assistant',
        timestamp: new Date().toISOString()
      }]);
    } finally {
      setIsThinking(false);
      setNewMessage('');
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="flex flex-col h-96 bg-white rounded-lg border">
      {/* Header */}
      <div className="bg-red-600 text-white p-3 rounded-t-lg">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold">Chat Support</h3>
          <div className="flex items-center">
            <div className={`w-2 h-2 rounded-full mr-2 ${isConnected ? 'bg-green-400' : 'bg-red-400'}`}></div>
            <span className="text-sm">{isConnected ? 'Connected' : 'Disconnected'}</span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 mt-8">
            <p>No messages yet. Start a conversation!</p>
            <p className="text-sm mt-2">
              {user?.role === 'Patient' 
                ? 'Ask questions to donors about blood donation or health concerns.'
                : 'Help patients with their questions about blood donation and health.'
              }
            </p>
          </div>
        ) : (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.senderRole === user?.role ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs px-3 py-2 rounded-lg ${
                  msg.senderRole === user?.role
                    ? 'bg-red-600 text-white'
                    : msg.senderRole === 'Donor'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                <div className="text-sm font-medium mb-1">
                  {msg.senderName} ({msg.senderRole})
                </div>
                <div className="text-sm">{msg.message}</div>
                <div className="text-xs opacity-70 mt-1">
                  {formatTime(msg.timestamp)}
                </div>
              </div>
            </div>
          ))
        )}
        {isThinking && (
          <div className="flex justify-start">
            <div className="max-w-xs px-3 py-2 rounded-lg bg-gray-100 text-gray-800">
              <div className="text-sm font-medium mb-1">Assistant</div>
              <div className="text-sm">Typing...</div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <form onSubmit={sendMessage} className="p-4 border-t">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
            disabled={false}
          />
          <button
            type="submit"
            disabled={!newMessage.trim() || isThinking}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isThinking ? 'Thinking…' : 'Send'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Chatbot;
