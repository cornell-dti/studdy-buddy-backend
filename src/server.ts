import * as express from 'express';
import * as http from 'http';
import * as socketio from 'socket.io';

import { isValidCourseId, searchCourse } from "./courses";

const app = express();

const server = http.createServer(app);

const io = socketio(server);

// TODO: WIP Basic Chat Functionality.

io.on('connect', (socket) => {
    socket.on('room', (courseId) => {
        if (isValidCourseId(courseId)) {
            socket.join(courseId);

            socket.emit('join_room', courseId);
        } else {
            socket.emit('no_room', courseId);
        }
    });

    socket.on('leave_room', (courseId) => {
        socket.leave(courseId);
    });

    socket.on('chat', (message) => {
        if (`${message.courseId}` in socket.rooms) {
            const {
                name,
                text,
            } = message;

            io.to(`${message.courseId}`).emit('chat', { name, text, acknowledged: Date.now() });
        }
    });

    console.log('Some client connected!');
});

const port = process.env.PORT || 5000;

app.get('/', (req, res) => {
    res.status(200).send();
});

app.get('/courses', (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");

    const search = req.query.search;

    if (typeof search !== 'string') {
        return res.status(400).send("Bad Request");
    }

    res.status(200).send(searchCourse(search));
});

server.listen(port, () => {
    console.log(`Serving running on port ${port}`);
});