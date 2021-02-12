import {createContext} from 'react';
import SocketIOClient from 'socket.io-client';
import {ChatMessage} from '~websocketEvents/types';
import {Cell} from '~iPythonTypes';

export interface GlobalState {
    toggled: boolean;
    setToggled: (toggled: boolean) => void;
    socket: SocketIOClient.Socket | null;
    messages: ChatMessage[];
    admin: boolean,
    userName: string;
    pair: string | null;
    selectedCells: Set<Cell>;
    chatOpened: boolean;
    setChat: (chatOpened: boolean) => void;
    adminOpened: boolean;
    setAdmin: (adminOpened: boolean) => void;
    flowchartOpened: boolean;
    setFlowchart: (flowchartOpened: boolean) => void;
    accepted: boolean;
}

export const MainContext = createContext<GlobalState>({
    toggled: true,
    setToggled: (_toggled) => {
    },
    pair: null,
    admin: false,
    userName: '',
    socket: null,
    messages: [],
    selectedCells: new Set<Cell>(),
    chatOpened: false,
    setChat: (_chatOpened: boolean) => {
    },
    flowchartOpened: true,
    setFlowchart: (_flowchartOpened: boolean) => {
    },
    accepted: false,
    adminOpened: false,
    setAdmin: (_adminOpened: boolean) => {
    },
});
