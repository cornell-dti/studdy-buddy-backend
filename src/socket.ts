import * as socketio from 'socket.io';

import * as http from 'http';

import * as firebase from 'firebase-admin';

import { isValidCourseId } from "./courses";
import { isObject } from "./typeUtils";

import { ClientEvent, isChatMessage, ReceivedChatMessage, SentChatMessage, ServerEvent } from "./types";

// TODO: There might be a better way to do this but for now let's enforce types
//       on socket.io's interfaces.
declare module 'socket.io' {
    interface Socket {
        on(event: ServerEvent, callback: (...args: unknown[]) => void): this;
        emit(...args: never[]): boolean;
        emit(event: ClientEvent.BadInput): boolean;
        emit(event: ClientEvent.NoRoom, courseId: string): boolean;
        emit(event: ClientEvent.RoomJoined, courseId: string): boolean;
        emit(event: ClientEvent.Authenticated): boolean;

        authenticated?: boolean;

        info: {
            displayName?: string;
            email?: string;
        }
    }

    interface Namespace {
        emit(...args: never[]): boolean;
        emit(event: ClientEvent.Chat, message: SentChatMessage): boolean;
    }
}

export function initializeSocketIO(server: http.Server) {
    const io = socketio(server, { origins: '*:*' });

    class SocketHandler {
        private socket: socketio.Socket;

        constructor(socket: socketio.Socket) {
            this.socket = socket;
        }

        badInput(): void {
            const { socket } = this;

            socket.emit(ClientEvent.BadInput);
        }

        study(courseId: string) {

        }

        joinRoom(courseId: string) {
            const { socket } = this;

            if (isValidCourseId(courseId)) {
                socket.join(courseId);
                socket.emit(ClientEvent.RoomJoined, courseId);
            } else {
                socket.emit(ClientEvent.NoRoom, courseId);
            }
        }

        leaveRoom(courseId: string) {
            const { socket } = this;

            socket.leave(courseId);
        }

        chat(message: ReceivedChatMessage) {
            const { socket } = this;

            if (`${message.courseId}` in socket.rooms) {
                const {
                    courseId,
                    sent,
                    name,
                    text,
                } = message;

                io.to(`${message.courseId}`).emit(ClientEvent.Chat, {
                    name,
                    text,
                    sent,
                    courseId,
                    acknowledged: Date.now()
                });
            }
        }
    }

    function setupSocket(socket: socketio.Socket) {
        const handler = new SocketHandler(socket);
        console.log('setup?');
        socket.on(ServerEvent.JoinRoom, (courseId) => {
            if (typeof courseId === 'string') {
                console.log(courseId);
                return handler.joinRoom(courseId);
            }

            return handler.badInput();
        });

        socket.on(ServerEvent.LeaveRoom, (courseId) => {
            if (typeof courseId === 'string') {
                return handler.leaveRoom(courseId);
            }

            return handler.badInput();
        });

        socket.on(ServerEvent.Chat, (message) => {
            if (isChatMessage(message)) {
                return handler.chat(message);
            }

            return handler.badInput();
        });

    }

    io.sockets
        .on('connection', socket => {

            setTimeout(() => {
                if (!socket.authenticated) {
                    console.log('disconnected client!');
                    socket.disconnect();
                }
            }, 15 * 1000 /* ms */);

            socket.on(ServerEvent.Authenticate, (options) => {
                if (socket.disconnected) return;

                if (!isObject(options)) {
                    return socket.disconnect();
                }

                const { JWT = null } = options;

                if (typeof JWT !== 'string') {
                    return socket.disconnect();
                }

                const jwt = JWT;

                try {
                    firebase.auth().verifyIdToken(jwt, true).then((claims) => {
                        socket.info = {};
                        socket.info.email = claims.email;

                        // TODO: Add 'authenticating'
                        socket.authenticated = true;

                        return firebase.auth().getUser(claims.uid);
                    }).then(user => {
                        socket.info.email = user.email;
                        socket.info.displayName = user.displayName;

                        socket.authenticated = true;

                        socket.emit(ClientEvent.Authenticated);

                        setupSocket(socket);
                    }).catch(err => {
                        console.error(err);

                        // TODO: Prevent connections on unauthorized users.
                        socket.disconnect();
                    });
                } catch (err) {
                    console.error(err);

                    // TODO: Prevent connections on unauthorized users.
                    socket.disconnect();
                }
            });
        });
}