import React, {useContext} from 'react';
import Styled from 'styled-components';
import {ChatInput} from '~components/chat/input';
import {ChatHistory} from '~components/chat/history';
import {MainContext} from '~contexts/mainContext';
import {CheckmarkCircle2Outline} from '@styled-icons/evaicons-outline/CheckmarkCircle2Outline';
import {CircleFill} from '@styled-icons/bootstrap/CircleFill';
import {MsgType} from '~websocketEvents/types';
import {PaneClose} from '@styled-icons/fluentui-system-filled/PaneClose';
import {Random} from '@styled-icons/open-iconic/Random';
import {Search} from '@styled-icons/bootstrap/Search';

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
    grid-template-rows: 30px 30px 30px 40fr 20fr;
    grid-template-columns: 100%;
    grid-row-gap: 5px;
`;

const PairedWith = Styled.div`
    height: 32px;
    line-height: 30px;
    width: 200px;
    text-align: center;
    background: #f8f8f8;
    border-radius: 100px;
    border: 2px solid #1a936f;
    position: relative;
    top: -3px;
    left: 90px;
    color: #1a936f;
`;

export const UnpairIcon = Styled(PaneClose)`
    height: 25px;
    color: #cc444b;
    padding: 2px;
    margin: 2px;
`;

export const RandomIcon = Styled(Random)`
    height: 25px;
    color: #9e9e9e;
    padding: 2px;
    margin: 2px;
`;

export const SearchIcon = Styled(Search)`
    height: 25px;
    color: #9e9e9e;
    padding: 2px;
    margin: 2px;
`;

export const PairingChoice = Styled.div`
    height: 32px;
    line-height: 30px;
    width: 100px;
    text-align: center;
    background: #f8f8f8;
    border-radius: 100px;
    border: 2px solid #9e9e9e;
    position: relative;
    top: -24px;
    left: 150px;
    margin-top: 20px;
    cursor: pointer;
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
            </PairedWith>
            <PairingChoice>
                <ActivityIcon activity={content}/> {content}
            </PairingChoice>
            <PairingChoice onClick={unpair}>
                <UnpairIcon/>
                Exit
            </PairingChoice>
            <ChatHistory/>
            <ChatInput/>
        </ChatContainer>
    );
};
