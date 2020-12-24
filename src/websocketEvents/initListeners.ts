import SocketIOClient from 'socket.io-client';
import {onMessage, onPair} from '~websocketEvents/chat/discussion';
import {Extension} from '~components/extension';

export const initListeners = (socket: SocketIOClient.Socket, extension: Extension) => {
    socket.on('message', onMessage(extension));
    socket.on('foundPair', onPair(extension));
};
