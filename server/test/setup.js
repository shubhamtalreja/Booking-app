const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');

let mongoServer;

// beforeAll will run once before all tests
beforeAll(async () => {
  // Start an in-memory MongoDB server
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  
  // Connect Mongoose to the in-memory server
  await mongoose.connect(mongoUri);
});

// afterEach will run after each test
afterEach(async () => {
  // Get all collections
  const collections = mongoose.connection.collections;
  // Delete all documents in each collection
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
});

// afterAll will run once after all tests are finished
afterAll(async () => {
  // Disconnect Mongoose and stop the in-memory server
  await mongoose.disconnect();
  await mongoServer.stop();
});