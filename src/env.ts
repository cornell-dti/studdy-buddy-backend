import * as dotenv from 'dotenv';

if (process.env.NODE_ENV !== 'production') {
    console.log('Loading environment from .env in development...');
    dotenv.config();
}
