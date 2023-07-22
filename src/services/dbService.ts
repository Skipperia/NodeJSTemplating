import { Collection, Db, MongoClient } from 'mongodb';
import Redis from 'ioredis';

import { logger } from '../utils/logger';

interface Product extends Document {
    _id: string;
}


const dbConnectionStatus: any = {
    mongoDbConnection: false,
    redisConnection: false
}

//init mongoDb client
const mongodbHost: string = process.env.REDIS_HOST || 'localhost';
const mongodbPort: number = Number(process.env.REDIS_PORT) || 27017;
const mongoClient = new MongoClient(`mongodb://${mongodbHost}:${mongodbPort}`);


//init redis client
const redisHost: string = process.env.REDIS_HOST || 'localhost';
const redisPort: number = Number(process.env.REDIS_PORT) || 6379;
const redis = new Redis({
    host: redisHost,
    port: redisPort,
});



const getProductById = async (id: string): Promise<Product | null> => {
    const redisKey = `product:${id}`;

    let data: string | null = await redis.get(redisKey);
    if (data) {
        return JSON.parse(data) as Product;
    }

    // If not in Redis, fetch from MongoDB
    const db: Db = mongoClient.db('testdb');
    const collection: Collection<Product> = db.collection('products');
    const product: Product | null = await collection.findOne({ _id: id });

    if (product) {
        // Store in Redis for future use
        await redis.set(redisKey, JSON.stringify(product));
        return product;
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

export {
    getProductById
}