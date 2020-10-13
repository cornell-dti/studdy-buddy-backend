
import * as http from 'http';

import app from './routes';

import {initialize as initializeAuth } from './firebase';

import  './socket';
import './env';

initializeAuth();

const server = http.createServer(app);

const port = process.env.PORT || 5000;

server.listen(port, () => {
    console.log(`Serving running on port ${port}`);
});

export default server;