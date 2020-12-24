import {GlobalState, MainContext} from '~contexts/mainContext';
import React, {Component} from 'react';
import Styled from 'styled-components';
import SocketIOClient from 'socket.io-client';
import {initListeners} from '~websocketEvents/initListeners';
import {ChatMessage} from '~websocketEvents/types';
import {Chat} from '~components/chat';
import {NoPair} from '~components/chat/noPair';

const SideBarContainer = Styled.div`
    width: 400px;
    height: calc(100% - 130px);
    right: 10px;
    top: 120px;
    position: fixed;
    background-color: #eeeeee;
    border: 1px solid #999;
    color: black;
    z-index: 100000;
    padding: 10px;
    border-radius: 10px;
`;

export class Extension extends Component<{}, GlobalState> {
    state: GlobalState;

    constructor(props: {}) {
        super(props);
        const path = window.location.href.split('/');
        const userName = path[path.indexOf('user') + 1];

        this.state = {
            userName,
            socket: null,
            pair: null,
            messages: [],
        };
    }

    public addMessage = (message: ChatMessage) => {
        this.setState(prev => ({...prev, messages: [...prev.messages, message]}));
    }

    public foundPair = (message: string) => {
        this.setState({pair: message});
    }

    public componentDidMount = () => {
        const socket = SocketIOClient(`ws://localhost:3000?user=${this.state.userName}`);
        initListeners(socket, this);
        this.setState({socket});
    }

    render() {
        return <MainContext.Provider value={this.state}>
            <SideBarContainer>
                {this.state?.pair !== null ? <Chat/> :
                    <NoPair>You haven't been paired with anyone, wait for someone to log in</NoPair>}
            </SideBarContainer>
        </MainContext.Provider>;
    }
}
