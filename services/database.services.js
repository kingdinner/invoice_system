const { MongoClient } = require('mongodb');

// Connection URL and Database Name
const url = 'mongodb://localhost:27017'; // Replace with your MongoDB server URL
const dbName = 'mydatabase'; // Replace with your database name

// Create a new MongoClient
const client = new MongoClient(url);

// Connect to the server
client.connect(function (err) {
  if (err) {
    console.error('Error connecting to MongoDB:', err);
    return;
  }

  console.log('Connected to MongoDB');

  // Perform database operations here
  const db = client.db(dbName);

  // Example: Insert a document into a collection
  const collection = db.collection('mycollection');
  collection.insertOne({ name: 'John', age: 30 }, function (err, result) {
    if (err) {
      console.error('Error inserting document:', err);
      return;
    }

    console.log('Document inserted:', result.ops);
  });

  // Close the connection
  client.close();
});
