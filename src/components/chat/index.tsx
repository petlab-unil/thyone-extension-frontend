import React, {useContext} from 'react';
import Styled from 'styled-components';
import {ChatInput} from '~components/chat/input';
import {ChatHistory} from '~components/chat/history';
import {MainContext} from '~contexts/mainContext';
import {CheckmarkCircle2Outline} from '@styled-icons/evaicons-outline/CheckmarkCircle2Outline';
import {CircleFill} from '@styled-icons/bootstrap/CircleFill';
import {MsgType} from '~websocketEvents/types';
import {PaneClose} from '@styled-icons/fluentui-system-filled/PaneClose';

interface ChatComponentsProps{
    activity?: string;
}

const PairedIcon = Styled(CheckmarkCircle2Outline)`
    height: 25px;
    color: #1a936f;
    padding: 2px;
    margin: 2px;
`;

const ActivityIcon = Styled(CircleFill)`
    height: 15px;
    color: ${({activity}: ChatComponentsProps) => activity === 'active' ? '#00b300' : activity === 'away' ? '#e60000' : '#a9a9a9'};
`;

const ChatContainer = Styled.div`
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-rows: 40px 40fr 20fr;
    grid-template-columns: 100%;
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

export const UnpairIcon = Styled(PaneClose)`
    height: 25px;
    color: #cc444b;
    padding: 2px;
    margin: 2px;
`;

export const Chat = () => {
    const {pair, messages, userName, socket} = useContext(MainContext);
    const content = '' || messages.filter(msg => msg.msgType === MsgType.Activity && msg.sender !== userName).sort((a, b) => { return b.timeStamp - a.timeStamp; })[0]?.content;

    const unpair = () => {
        socket?.emit('unpair');
    };

    return (
        <ChatContainer>
            <PairedWith>
                <PairedIcon/> Paired with {pair}
                <br/>
                <ActivityIcon activity={content}/> {content}
                <UnpairIcon onClick={unpair}/>
            </PairedWith>
            <ChatHistory/>
            <ChatInput/>
        </ChatContainer>
    );
};
