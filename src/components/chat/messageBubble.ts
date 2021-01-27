import Styled from 'styled-components';

interface MessageBubbleProps {
    isSender: boolean;
}

export const MessageBubble = Styled.div`
    max-width: 80%;
    font-size: 13px;
    display: inline-block;
    background-color: ${({isSender}: MessageBubbleProps) => isSender ? '#000000cc' : '#ffebe5fc'};
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    border-bottom-right-radius: ${({isSender}: MessageBubbleProps) => isSender ? '0px' : '10px'};
    border-bottom-left-radius: ${({isSender}: MessageBubbleProps) => isSender ? '10px' : '0px'};
    padding: 10px;
    margin: 5px 0;
    color: ${({isSender}: MessageBubbleProps) => isSender ? 'white' : 'black'};
    float: ${({isSender}: MessageBubbleProps) => isSender ? 'right' : 'left'};
    clear: both;
`;

export const CellContainer = Styled.div`
    margin: 20px 0;
    width: calc(100% - 25px);
     ${({isSender}: MessageBubbleProps) => isSender ? 'margin-left: 20px' : 'margin-right: 20px'};
     & .CodeMirror {
        font-size: 12px;
     }
`;
