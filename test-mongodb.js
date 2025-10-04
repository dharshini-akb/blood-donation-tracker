const mongoose = require('mongoose');

async function testMongoDB() {
  try {
    console.log('🔍 Testing MongoDB connection...');
    
    const uri = 'mongodb://localhost:27017/blood-donation-tracker';
    
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ MongoDB connected successfully!');
    console.log('✅ Database: blood-donation-tracker');
    console.log('✅ Connection string:', uri);
    
    // Test creating a collection
    const testCollection = mongoose.connection.collection('test');
    await testCollection.insertOne({ test: 'connection', timestamp: new Date() });
    console.log('✅ Database write test passed');
    
    // Clean up test data
    await testCollection.deleteOne({ test: 'connection' });
    console.log('✅ Database cleanup test passed');
    
    await mongoose.connection.close();
    console.log('✅ MongoDB connection closed');
    
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    
    if (error.name === 'MongoNetworkError') {
      console.error('\n💡 MongoDB is not running!');
      console.error('   Please start MongoDB service');
      console.error('   On Windows: Check Services app for MongoDB');
      console.error('   On macOS/Linux: Run "mongod" command');
    } else if (error.name === 'MongoServerSelectionError') {
      console.error('\n💡 MongoDB server is not accessible!');
      console.error('   Please check MongoDB configuration');
    }
  }
}

testMongoDB();
