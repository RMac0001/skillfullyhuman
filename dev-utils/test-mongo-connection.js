// /dev-utils/test-mongo-connection.js
const { MongoClient } = require('mongodb');

async function testConnection() {
  const uri = "mongodb://localhost:27017";
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("Connected successfully to MongoDB");

    const dbs = await client.db().admin().listDatabases();
    console.log("Databases:", dbs.databases.map(db => db.name));
  } catch (e) {
    console.error("Connection error:", e);
  } finally {
    await client.close();
  }
}

testConnection();