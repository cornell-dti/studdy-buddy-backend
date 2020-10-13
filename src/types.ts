import { has, hasNumber, hasString, isObject } from "./typeUtils";

export enum ServerEvent {
    JoinRoom = 'join_room',
    LeaveRoom = 'leave_room',
    Chat = 'chat',
    Authenticate = 'authenticate'
}

export enum ClientEvent {
    BadInput = 'bad_input',
    RoomJoined = 'room_joined',
    NoRoom = 'no_room',
    Chat = 'chat',
    Authenticated = 'authenticated'
}

export interface ChatMessage {
    courseId: string;
    name: string;
    text: string;
    sent: number;
}

export function isChatMessage(obj: unknown): obj is ReceivedChatMessage {
    if (isObject(obj) && has(obj, ['text', 'sent', 'courseId', 'name'])) {
        if (hasString(obj, 'text') &&
            hasString(obj, 'courseId') &&
            hasNumber(obj, 'sent') &&
            hasString(obj, 'name')) {
            const _: ReceivedChatMessage = obj;

            return true;
        }
    }

    return false;
}


export interface ReceivedChatMessage extends ChatMessage { }

export interface SentChatMessage extends ChatMessage {
    acknowledged: number;
}

