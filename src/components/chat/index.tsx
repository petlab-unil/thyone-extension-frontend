import React, {useContext} from 'react';
import Styled from 'styled-components';
import {ChatInput} from '~components/chat/input';
import {ChatHistory} from '~components/chat/history';
import {MainContext} from '~contexts/mainContext';
import {CheckmarkCircle2Outline} from '@styled-icons/evaicons-outline/CheckmarkCircle2Outline';

const PairedIcon = Styled(CheckmarkCircle2Outline)`
    height: 25px;
    color: #1a936f;
    padding: 2px;
    margin: 2px;
`;

const ChatContainer = Styled.div`
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-rows: 40px 40fr 20fr;
    grid-template-colums: 100%;
    grid-row-gap: 20px;
`;

const PairedWith = Styled.div`
    height: 36px;
    line-height: 30px;
    width: 200px;
    text-align: center;
    background: #f8f8f8;
    border-radius: 100px;
    border: 2px solid #1a936f;
    position: relative;
    top: 12px;
    left: 90px;
    color: #1a936f;
`;

export const Chat = () => {
    const {pair} = useContext(MainContext);
    return (
        <ChatContainer>
            <PairedWith>
                <PairedIcon/>
                Paired with {pair}</PairedWith>
            <ChatHistory/>
            <ChatInput/>
        </ChatContainer>
    );
};
