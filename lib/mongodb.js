import { MongoClient } from 'mongodb';

const client = new MongoClient(process.env.MONGODB_URI);
const dbName = 'movie_streamer';

export async function connectToDB() {
  if (!client.isConnected()) await client.connect();
  return client.db(dbName);
}
