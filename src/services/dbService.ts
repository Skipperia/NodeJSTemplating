import { MongoClient } from 'mongodb';
import Redis from 'ioredis';

import { logger } from '../utils/logger';



const dbConnectionStatus: any = {
    mongoDbConnection: false,
    redisConnection: false
}

//init mongoDb client
const mongodbHost: string = process.env.REDIS_HOST || 'localhost';
const mongodbPort: number = Number(process.env.REDIS_PORT) || 6379;
const mongoClient = new MongoClient(`mongodb://${mongodbHost}:${mongodbPort}`);


//init redis client
const redisHost: string = process.env.REDIS_HOST || 'localhost';
const redisPort: number = Number(process.env.REDIS_PORT) || 6379;
const redis = new Redis({
    host: redisHost,
    port: redisPort,
});



const getProductById = async (id: string) => {
    const redisKey = `product:${id}`;

    // Try to fetch from Redis first
    let data = await redis.get(redisKey);
    if (data) {
        return JSON.parse(data);
    }

    // If not in Redis, fetch from MongoDB
    const db = mongoClient.db('testdb');
    const collection = db.collection('posts');
    const query = { _id: id };
    data = await collection.findOne(query);

    if (data) {
        // Store in Redis for future use
        await redis.set(redisKey, JSON.stringify(data));
        return data;
    } else {
        return null;
    }
};

mongoClient.connect().then(() => {
    logger.info(`Connected to MongoDB:${mongodbHost}:${mongodbPort}`);
    dbConnectionStatus.mongoDbConnection = true;
}).catch(error => {
    logger.error(`Failed to connect to MongoDB: ${mongodbHost}:${mongodbPort} error: ${error}`);
    throw new Error(`Failed connecting to the mongodb server: ${error}`);
});

redis.on('connect', () => {
    logger.info(`Connected to redis:${redisHost}:${redisPort}`);
    dbConnectionStatus.redisConnection = true;
});

redis.on('error', (error) => {
    logger.error(`Failed connecting to redis:${redisHost}:${redisPort} error: ${error}`);
    throw new Error(`Failed connecting to redis:${redisHost}:${redisPort} error: ${error}`)
});
