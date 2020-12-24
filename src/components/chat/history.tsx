import React, {useContext} from 'react';
import {MainContext} from '~contexts/mainContext';
import {MessageBubble} from './messageBubble';
import Styled from 'styled-components';
import {scrollbar} from '~components/scrollBar';

const HistoryContainer = Styled.div`
    overflow-y: auto;
    ${scrollbar}
`;

export const ChatHistory = () => {
    const {messages, userName} = useContext(MainContext);
    return <HistoryContainer>
        {messages.map(msg => <MessageBubble key={msg.timeStamp} isSender={userName === msg.sender}>{msg.content}</MessageBubble>)}
    </HistoryContainer>;
};
