import React, {useContext} from 'react';
import Styled from 'styled-components';
import {ChatInput} from '~components/chat/input';
import {ChatHistory} from '~components/chat/history';
import {MainContext} from '~contexts/mainContext';

const ChatContainer = Styled.div`
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-rows: 40px 80fr 20fr;
    grid-template-colums: 100%;
    grid-row-gap: 20px;
`;

const PairedWith = Styled.div`
    border-bottom: 1px solid black;
    line-height: 40px;
    width: 100%;
    text-align: center;
`;

export const Chat = () => {
    const {pair} = useContext(MainContext);
    return (
        <ChatContainer>
            <PairedWith>Paired with {pair}</PairedWith>
            <ChatHistory/>
            <ChatInput/>
        </ChatContainer>
    );
};
