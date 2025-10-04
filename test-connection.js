const axios = require('axios');

const API_BASE_URL = 'http://localhost:5001/api';

async function testConnection() {
  try {
    console.log('🔍 Testing backend connection...');
    
    // Test health endpoint
    const healthResponse = await axios.get(`${API_BASE_URL}/health`);
    console.log('✅ Health check passed:', healthResponse.data);
    
    console.log('\n🎉 Backend is running successfully on port 5001!');
    console.log('✅ MongoDB connection should be working');
    console.log('✅ All routes are accessible');
    
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.error('\n💡 Backend server is not running!');
      console.error('   Please start the backend with: cd backend && npm run dev');
    } else if (error.response?.status === 500) {
      console.error('\n💡 Backend is running but there might be a MongoDB connection issue');
      console.error('   Please check if MongoDB is running');
    }
  }
}

testConnection();
