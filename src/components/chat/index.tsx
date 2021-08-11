import React, {useContext, useEffect, useState} from 'react';
import Styled from 'styled-components';
import {ChatInput} from '~components/chat/input';
import {ChatHistory} from '~components/chat/history';
import {MainContext} from '~contexts/mainContext';
import {CheckmarkCircle2Outline} from '@styled-icons/evaicons-outline/CheckmarkCircle2Outline';
import {CircleFill} from '@styled-icons/bootstrap/CircleFill';
import {MsgType} from '~websocketEvents/types';

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
    height: 20px;
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

export const Chat = () => {
    const {pair, messages} = useContext(MainContext);
    const [activity, setActivity] = useState('');
    let interval: number = 0;
    const lastPing = messages.filter(msg => msg.msgType === MsgType.Activity).sort((a, b) => { return b.timeStamp - a.timeStamp; })[0];

    useEffect(() => {
        checkAvailability();
        interval = setInterval(() => checkAvailability(), 10000); // every 10 seconds
    }, []);

    useEffect(() => {
        return () => {
            clearInterval(interval);
        };
    }, []);

    function checkAvailability() {
        const diff = Math.round((((Date.now() - lastPing.timeStamp) % 86400000) % 3600000) / 60000); // milliseconds to minutes
        const content = diff > 2 ? 'away' : lastPing?.content || '';
        setActivity(content);
    }

    return (
        <ChatContainer>
            <PairedWith>
                <PairedIcon/> Paired with {pair}
                <br/>
                <ActivityIcon activity = {activity}/> {activity}
            </PairedWith>
            <ChatHistory/>
            <ChatInput/>
        </ChatContainer>
    );
};
