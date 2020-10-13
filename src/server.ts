
import * as http from 'http';

import app from './routes';

import {initialize as initializeAuth } from './firebase';

import  './socket';
import './env';

import * as cors from 'cors';
import { initializeSocketIO } from './socket';

const corsOptions = {
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200,
  credentials: true
}

app.use(cors(corsOptions));

initializeAuth();

const server = http.createServer(app);

initializeSocketIO(server);

const port = process.env.PORT || 5000;

server.listen(port, () => {
    console.log(`Serving running on port ${port}`);
});

export default server;