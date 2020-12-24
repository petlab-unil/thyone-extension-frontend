import Styled from 'styled-components';

interface MessageBubbleProps {
    isSender: boolean;
}

export const MessageBubble = Styled.div`
    max-width: 80%;
    font-size: 16px;
    display: inline-block;
    background-color: ${({isSender}: MessageBubbleProps) => isSender ? '#0484fe' : '#3e4042'};
    border-radius: 10px;
    padding: 10px;
    margin: 5px 0;
    color: white;
    float: ${({isSender}: MessageBubbleProps) => isSender ? 'right' : 'left'};
    clear: both;
`;
