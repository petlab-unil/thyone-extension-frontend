import React, {useContext} from 'react';
import Styled from 'styled-components';
import {ChatInput} from '~components/chat/input';
import {ChatHistory} from '~components/chat/history';
import {MainContext} from '~contexts/mainContext';

const ChatContainer = Styled.div`
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-rows: 10px 40px 80fr 20fr;
    grid-template-colums: 100%;
    grid-row-gap: 20px;
`;

const PairedWith = Styled.div`
    border-bottom: 1px solid black;
    line-height: 40px;
    width: 100%;
    text-align: center;
`;

const UntoggleButton = Styled.div`
    height: 100%;
    width: 100%;
    float: right;
    cursor: pointer;
`;

export const Chat = () => {
    const {pair, setToggled} = useContext(MainContext);
    return (
        <ChatContainer>
            <UntoggleButton onClick={() => setToggled(false)}>Untoggle</UntoggleButton>
            <PairedWith>Paired with {pair}</PairedWith>
            <ChatHistory/>
            <ChatInput/>
        </ChatContainer>
    );
};
