import { MongoClient, Db } from 'mongodb';
import { CONFIG } from '../config';

let client: MongoClient | null = null;
let dbInstance: Db | null = null;

export async function getMongoClient(): Promise<MongoClient> {
  if (!client) {
    client = new MongoClient(CONFIG.MONGODB_URI, {
      connectTimeoutMS: 10000,
      serverSelectionTimeoutMS: 10000
    });
    await client.connect();
    console.log('[CALIBER MongoDB] Connected successfully to MongoDB Atlas.');
  }
  return client;
}

export async function getDb(): Promise<Db> {
  if (!dbInstance) {
    const mongoClient = await getMongoClient();
    dbInstance = mongoClient.db('caliber');
  }
  return dbInstance;
}
