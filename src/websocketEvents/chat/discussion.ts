import {ChatMessage} from '~websocketEvents/types';
import {Extension} from '@components/extension';

export const onMessage = (extension: Extension) => (message: ChatMessage) => {
    extension.addMessage(message);
};

export const onPair = (extension: Extension) => (message: string) => {
    console.log(message);
    extension.foundPair(message);
};
