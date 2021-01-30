import React, {KeyboardEvent, useContext, useState} from 'react';
import {MainContext} from '~contexts/mainContext';
import Styled from 'styled-components';

const DivInput = Styled.textarea`
    width: 95%;
    height: 168px;
    background-color: #f0f2f5;
    border: 1px solid #f0f2f5;
    margin: 10px;
    padding: 10px;
    resize: none;
    position: relative;
    bottom: 20px;
    border-radius: 20px;
    cursor: text;
    ::placeholder {
    color: #00000033;
    font-style: italic;
    font-size: 15px;
    }
     &:focus {
    outline: none;
    border-color: #cfcfcf;
  }
`;

export const ChatInput = () => {
    const [text, updateText] = useState<string>('');
    const {socket} = useContext(MainContext);
    const sendMessage = () => {
        if (!text.length) return;
        socket?.emit('msg', text);
        updateText('');
    };

    const keyDownEvent = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        e.stopPropagation();
        e.preventDefault();
        const {key} = e;
        if (key.length > 1) {
            if (key === 'Enter') {
                if (e.altKey || e.shiftKey) {
                    updateText(`${text}\n`);
                } else {
                    sendMessage();
                }
            } else if (key === 'Backspace') {
                updateText(`${text.slice(0, -1)}`);
            } else if (key === 'Tab') {
                updateText(`${text}    `);
            }
        } else {
            updateText(`${text}${key}`);
        }
    };

    return (<DivInput contentEditable={true} value={text} onKeyDown={keyDownEvent} placeholder={'Chat here...'} autoFocus={true}>
            </DivInput>);
};
