import {createContext} from 'react';
import SocketIOClient from 'socket.io-client';
import {ChatMessage} from '~websocketEvents/types';

export interface GlobalState {
    socket: SocketIOClient.Socket | null;
    messages: ChatMessage[];
    userName: string;
    pair: string | null;
}

export const MainContext = createContext<GlobalState>({pair: null, userName: '', socket: null, messages: []});
