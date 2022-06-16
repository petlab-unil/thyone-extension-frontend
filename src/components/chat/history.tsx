import React, {useContext} from 'react';
import {MainContext} from '~contexts/mainContext';
import Styled from 'styled-components';
import {scrollbar} from '~components/scrollBar';
import {MsgType} from '~websocketEvents/types';
import {MessageBubble, CellContainer} from '~components/chat/messageBubble';
// @ts-ignore
import Graph from 'react-graph-vis';
import {options} from '~components/flowChart/config';

const HistoryContainer = Styled.div`
    overflow-y: auto;
    overflow-x: hidden;
    ${scrollbar}
    padding: 10px;
`;

const GraphContainer = Styled.div`
    height: 450px;
    width: 90%;
    margin: auto;
    border: 1px solid lightgrey;
    border-radius: 5px;
    margin: 20px;
    display: inline-block;
`;

export const ChatHistory = () => {
    const {messages, userName} = useContext(MainContext);
    return <HistoryContainer id="hec_chat_history_container">
        {messages.map((msg) => {
            if (msg.msgType === MsgType.Msg) {
                return <MessageBubble key={msg.timeStamp}
                                      isSender={userName === msg.sender}>{msg.content}</MessageBubble>;
            }
            if (msg.msgType === MsgType.Cell) {
                return <CellContainer isSender={userName === msg.sender} dangerouslySetInnerHTML={{__html: msg.content}}/>;
            }
            if (msg.msgType === MsgType.FlowChart) {
                return <GraphContainer><Graph graph={JSON.parse(msg.content)} options={options}/></GraphContainer>;
            }
            throw new Error('Invalid msgtype');
        })
        }
    </HistoryContainer>;
};
