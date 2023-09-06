import { Collection, Db, MongoClient } from 'mongodb';
import Redis from 'ioredis';

import { logger } from '../utils/logger';

interface Product {
    _id: string;
}


const getProductById = async (id: string): Promise<Product | null> => {
    return { _id: "123" };
};


export {
    getProductById
}