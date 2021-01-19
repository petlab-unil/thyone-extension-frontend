import {createContext} from 'react';
import SocketIOClient from 'socket.io-client';
import {ChatMessage} from '~websocketEvents/types';
import {Cell} from '~iPythonTypes';

export interface GlobalState {
    toggled: boolean;
    setToggled: (toggled: boolean) => void;
    socket: SocketIOClient.Socket | null;
    messages: ChatMessage[];
    userName: string;
    pair: string | null;
    selectedCells: Set<Cell>;
    chatOpened: boolean;
}

export const MainContext = createContext<GlobalState>({
    toggled: true,
    setToggled: (_toggled) => {
    },
    pair: null,
    userName: '',
    socket: null,
    messages: [],
    selectedCells: new Set<Cell>(),
    chatOpened: false,
});
