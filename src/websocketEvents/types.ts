export enum MsgType {
    Msg,
    Cell,
    FlowChart,
}

export interface ChatMessage {
    msgType: MsgType;
    content: string;
    sender: string;
    timeStamp: number;
}

export interface DbDiscussion {
    _id?: string;
    userName1: string;
    userName2: string;
    messages: ChatMessage[];
}

export interface PairedInitialData {
    userName: string,
    discussion: DbDiscussion
}
