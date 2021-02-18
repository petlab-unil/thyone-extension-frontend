import SocketIOClient from 'socket.io-client';
import {onAccepted, onAdminQueue, onMessage, onPair, onPairDisconnected} from '~websocketEvents/chat/discussion';
import {Extension} from '~components/extension';

export const initListeners = (socket: SocketIOClient.Socket, extension: Extension) => {
    socket.on('message', onMessage(extension));
    socket.on('foundPair', onPair(extension));
    socket.on('pairDisconnected', onPairDisconnected(extension));
    socket.on('accepted', onAccepted(extension));
    socket.on('adminQueue', onAdminQueue(extension));
};
