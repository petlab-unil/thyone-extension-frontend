import {ChatMessage, PairedInitialData} from '~websocketEvents/types';
import {Extension} from '@components/extension';
import {QueueStatus} from '../../../../hec-extension-backend/src/websockets/types';

export const onMessage = (extension: Extension) => (message: ChatMessage) => {
    extension.addMessage(message);
};

export const onPair = (extension: Extension) => (message: PairedInitialData) => {
    extension.foundPair(message);
};

export const onPairDisconnected = (extension: Extension) => () => {
    extension.pairDisconnected();
};

export const onAccepted = (extension: Extension) => (accepted: boolean) => {
    extension.setAccepted(accepted);
};

export const onAdminQueue = (extension: Extension) => (adminQueue: QueueStatus) => {
    extension.setAdminQueue(adminQueue);
};

export const onPendingPairing = (extension: Extension) => () => {
    extension.pendingPairing();
};

export const onUserUnavailable = (extension: Extension) => () => {
    extension.userUnavailable();
};
