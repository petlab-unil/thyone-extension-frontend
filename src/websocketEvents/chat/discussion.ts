import {ChatMessage, PairedInitialData} from '~websocketEvents/types';
import {Extension} from '@components/extension';

export const onMessage = (extension: Extension) => (message: ChatMessage) => {
    extension.addMessage(message);
};

export const onPair = (extension: Extension) => (message: PairedInitialData) => {
    extension.foundPair(message);
};

export const onPairDisconnected = (extension: Extension) => () => {
    extension.pairDisconnected();
};
