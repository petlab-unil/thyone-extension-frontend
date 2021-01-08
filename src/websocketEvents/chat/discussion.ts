import {ChatMessage} from '~websocketEvents/types';
import {Extension} from '@components/extension';

export const onMessage = (extension: Extension) => (message: ChatMessage) => {
    extension.addMessage(message);
};

export const onPair = (extension: Extension) => (message: string) => {
    extension.foundPair(message);
};
