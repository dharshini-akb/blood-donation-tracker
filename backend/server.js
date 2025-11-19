const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const socketIo = require('socket.io');
const passport = require('./config/passport');

dotenv.config();

const app = express();
const server = http.createServer(app);
const allowedOrigin = process.env.FRONTEND_URL || 'http://localhost:3000';
const io = socketIo(server, {
  cors: {
    origin: allowedOrigin,
    methods: ["GET", "POST"],
  }
});


app.use(cors());
app.use(express.json());
app.use(passport.initialize());
app.set('trust proxy', true);
app.locals.dbConnected = true;
const fs = require('fs');
const path = require('path');
const storePath = path.join(__dirname, 'data', 'dev-store.json');
// ensure directory exists
try { fs.mkdirSync(path.dirname(storePath), { recursive: true }); } catch {}
let initialStore = { users: [], donations: [], bloodRequests: [], voluntaryCamps: [] };
try {
  if (fs.existsSync(storePath)) {
    const raw = fs.readFileSync(storePath, 'utf-8');
    initialStore = JSON.parse(raw);
  }
} catch {}
app.locals.memoryStore = app.locals.memoryStore || initialStore;
app.locals.saveStore = () => {
  try {
    fs.writeFileSync(storePath, JSON.stringify(app.locals.memoryStore, null, 2));
  } catch (e) {
    console.error('Failed to persist dev store:', e.message);
  }
};

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'Blood Donation Tracker API is running',
    timestamp: new Date().toISOString()
  });
});

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/blood-donation-tracker';
mongoose
  .connect(MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err?.message || err);
    app.locals.dbConnected = false;
    // persist current dev store on startup to ensure continuity
    app.locals.saveStore();
  });


app.use('/api/auth', require('./routes/auth'));
app.use('/api/schedules', require('./routes/scheduleRoutes'));
app.use('/api/blood-centers', require('./routes/bloodCenterRoutes'));
app.use('/api/voluntary-camp', require('./routes/voluntaryCamp'));
app.use('/api/blood', require('./routes/blood'));
app.use('/api/chat', require('./routes/chat'));
app.use('/api/donations', require('./routes/donations'));

try {
  app.use('/api/blood-requests', require('./routes/bloodRequestRoutes'));
} catch {  }


app.get('/', (_req, res) => res.json({ name: 'Blood Donation Tracker API', status: 'OK' }));
app.get('/api/health', (_req, res) => res.json({ status: 'OK' }));


app.use((req, res) => res.status(404).json({ status: 404, error: 'Not Found', path: req.originalUrl, method: req.method }));
app.use((err, _req, res, _next) => {
  console.error('💥 Unhandled error:', err);
  res.status(err.status || 500).json({ status: err.status || 500, error: err.message || 'Internal Server Error' });
});


io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join-room', (userRole) => {
    socket.join(userRole);
    console.log(`User ${socket.id} joined ${userRole} room`);
  });

 
  socket.on('send-message', (data) => {
    const { message, senderRole, senderName } = data;
    
    
    socket.broadcast.emit('receive-message', {
      message,
      senderRole,
      senderName,
      timestamp: new Date().toISOString()
    });
  });


  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});


const PORT = Number(process.env.PORT) || 5001;
server.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
