import React, {KeyboardEvent, useContext, useState} from 'react';
import {MainContext} from '~contexts/mainContext';
import Styled from 'styled-components';

const DivInput = Styled.textarea`
    background-color: white;
    border: 1px solid black;
    padding: 10px;
    resize: none;
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

    return (<DivInput contentEditable={true} value={text} onKeyDown={keyDownEvent}>
    </DivInput>);
};
