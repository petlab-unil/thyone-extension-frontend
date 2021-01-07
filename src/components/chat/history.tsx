import React, {useContext} from 'react';
import {MainContext} from '~contexts/mainContext';
import Styled from 'styled-components';
import {scrollbar} from '~components/scrollBar';
import {MsgType} from '~websocketEvents/types';
import {MessageBubble} from '~components/chat/messageBubble';

const HistoryContainer = Styled.div`
    overflow-y: auto;
    ${scrollbar}
`;

export const ChatHistory = () => {
    const {messages, userName} = useContext(MainContext);
    return <HistoryContainer>
        {messages.map((msg) => {
            if (msg.msgType === MsgType.Msg) {
                return <MessageBubble key={msg.timeStamp}
                                      isSender={userName === msg.sender}>{msg.content}</MessageBubble>;
            }
            if (msg.msgType === MsgType.Cell) {
                return <div dangerouslySetInnerHTML={{__html: msg.content}}/>;
            }
            throw new Error('Invalid msgtype');
        })
        }
    </HistoryContainer>;
};
