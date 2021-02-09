import {GlobalState, MainContext} from '~contexts/mainContext';
import React, {Component} from 'react';
import Styled from 'styled-components';
import SocketIOClient from 'socket.io-client';
import {initListeners} from '~websocketEvents/initListeners';
import {ChatMessage, PairedInitialData} from '~websocketEvents/types';
import {Chat} from '~components/chat';
import {NoPair, NoPairIcon} from '~components/chat/noPair';
import {Cell, IPython} from '~iPythonTypes';
import {ToggleButton} from '~components/toggleButton';
import {FlowChart} from '~components/flowChart';
import {Minimize} from '@styled-icons/feather/Minimize';
import {ChatButton, FlowchartButton, FlowchartIcon, PeerShareIcon, TabContainer} from './tabComponents';
import {EventTypes, LoggingApi} from '~loggingApi';

const MinimizeIcon = Styled(Minimize)`
    float: right;
    height: 20px;
    position: relative;
    top: 4px;
    color: #e7e7e7;
    cursor: pointer;
    margin-right: 5px;
    padding: 2.5px;
    stroke-width: 2.3px;
`;

const UntoggleButtonContainer = Styled.div`
    height: 2em;
    line-height: 2em;
    width: 100%;
    float: right;
    background-color: #161b22;
    padding-bottom: 2px;
    border-top-left-radius: 7px;
    border-top-right-radius: 7px;
`;

const TOOLBAR_PRESET_NAME = 'Share Cell';

const SideBarContainer = Styled.div`
    width: 400px;
    height: calc(100% - 130px);
    right: 10px;
    top: 120px;
    position: fixed;
    background-color: #fff;
    border: 1px solid #ababab;
    color: #000000;
    z-index: 100000;
    border-radius: 10px;
`;

interface ExtensionProps {
    iPython: IPython,
    cell: any,
    userName: string,
    token: string,
    loggingApi: LoggingApi,
}

export class Extension extends Component<ExtensionProps, GlobalState> {
    state: GlobalState;
    private readonly iPython: IPython;
    private readonly token: string;
    private readonly loggingApi: LoggingApi;
    private readonly cell: any;

    constructor(props: ExtensionProps) {
        super(props);
        this.iPython = props.iPython;
        this.token = props.token;
        this.loggingApi = props.loggingApi;
        this.cell = props.cell;

        this.state = {
            userName: props.userName,
            toggled: true,
            setToggled: this.setToggled,
            socket: null,
            pair: null,
            messages: [],
            selectedCells: new Set<Cell>(),
            chatOpened: false,
            setChat: this.setChat,
            flowchartOpened: true,
            setFlowchart: this.setFlowchart,
            accepted: false,
        };
    }

    private setChat = async (chatFlag: boolean) => {
        await this.setState({flowchartOpened: !chatFlag, chatOpened: chatFlag});
        const chatElem = document.querySelector('#hec_chat_history_container');
        if (chatElem === null) return;
        chatElem.scrollTop = chatElem.scrollHeight;
    }

    private setFlowchart = async (flowchartFlag: boolean) => {
        await this.setState({flowchartOpened: flowchartFlag, chatOpened: !flowchartFlag});
        const chatElem = document.querySelector('#hec_chat_history_container');
        if (chatElem === null) return;
        chatElem.scrollTop = chatElem.scrollHeight;
    }

    private setToggled = async (toggled: boolean) => {
        await this.setState({toggled});
        const chatElem = document.querySelector('#hec_chat_history_container');
        if (chatElem === null) {
            if (toggled) {
                await this.loggingApi.logEvent(EventTypes.EXTENSION_TOGGLED);
            } else {
                await this.loggingApi.logEvent(EventTypes.EXTENSION_UNTOGGLED);
            }
            return;
        }
        chatElem.scrollTop = chatElem.scrollHeight;
        if (toggled) {
            await this.loggingApi.logEvent(EventTypes.EXTENSION_TOGGLED);
        } else {
            await this.loggingApi.logEvent(EventTypes.EXTENSION_UNTOGGLED);
        }
    }

    public addMessage = async (message: ChatMessage) => {
        await this.setState(prev => ({...prev, messages: [...prev.messages, message]}));
        const chatElem = document.querySelector('#hec_chat_history_container');
        if (chatElem === null) return;
        chatElem.scrollTop = chatElem.scrollHeight;
    }

    public foundPair = ({userName, discussion}: PairedInitialData) => {
        this.setState({pair: userName, messages: discussion.messages});
        const chatElem = document.querySelector('#hec_chat_history_container');
        if (chatElem === null) return;
        chatElem.scrollTop = chatElem.scrollHeight;
    }

    public pairDisconnected = () => {
        this.setState({pair: null, messages: []});
    }

    public setAccepted = (accepted: boolean) => {
        this.setState({accepted});
    }

    private registerCellToolbar = () => {
        const {CellToolbar} = this.iPython;

        const selectCellUiCallback = CellToolbar.utils.checkbox_ui_generator(
            TOOLBAR_PRESET_NAME,
            (cell, value) => {
                cell.metadata.hecSelected = value;
                this.setState(({selectedCells}) => {
                    if (!value) {
                        selectedCells.delete(cell);
                    } else {
                        selectedCells.add(cell);
                    }
                    return {
                        selectedCells: new Set([...selectedCells]),
                    };
                });

            }, (cell) => {
                return cell.metadata.hecSelected;
            },
        );

        CellToolbar.register_callback(TOOLBAR_PRESET_NAME, selectCellUiCallback, 'code');
        CellToolbar.register_preset(TOOLBAR_PRESET_NAME, [TOOLBAR_PRESET_NAME], this.iPython.notebook);
        CellToolbar.global_show();
        CellToolbar.activate_preset(TOOLBAR_PRESET_NAME);
        this.iPython.notebook.metadata.celltoolbar = TOOLBAR_PRESET_NAME;
    }

    private updatePreviousSelectedCells = () => {
        this.setState({selectedCells: new Set(this.iPython.notebook.get_cells().filter(cell => cell.metadata.hecSelected))});
    }

    private setCallbacks = () => {
        // tslint:disable-next-line:no-this-assignment
        const self = this;
        this.iPython.notebook.get_cells().forEach((cell: any) => {
            const execute = cell.execute;
            const edit_mode = cell.edit_mode;
            cell.edit_mode = () => {
                edit_mode.apply(cell);
                self.loggingApi.logEvent(EventTypes.CELL_EDITED).then(() => {});
            };
            cell.execute = async () => {
                execute.apply(cell);
                await self.loggingApi.logEvent(EventTypes.CELL_EXECUTED);
            };
        });

        const create_element = this.cell.prototype.create_element;
        const edit_mode =  this.cell.prototype.edit_mode;
        this.cell.prototype.create_element = function () {
            create_element.apply(this);
            self.loggingApi.logEvent(EventTypes.CELL_CREATED).then(() => {});
            this.edit_mode = function () {
                edit_mode.apply(this);
                self.loggingApi.logEvent(EventTypes.CELL_EDITED).then(() => {});
            };
            const execute = this.execute;
            this.execute = async function () {
                execute.apply(this);
                await self.loggingApi.logEvent(EventTypes.CELL_EXECUTED);
            };
        };
    }

    private initJupyterBindings = () => {
        const shareSelectedCells = () => {
            this.state.selectedCells.forEach((cell) => {
                const cellContent = cell.element[0];
                if (cellContent === null) throw new Error('Cell content does not exist');
                const {outerHTML} = cellContent;
                this.state.socket?.emit('cell', outerHTML);
            });
        };

        this.iPython.toolbar.add_buttons_group([
            {
                label: 'Share Selected Cells',
                icon: 'fas fa-share-square',
                callback: shareSelectedCells,
            },
        ]);
    }

    public componentDidMount = () => {
        const socket = SocketIOClient(process.env.BACKEND_WS ?? '', {
            transportOptions: {
                polling: {
                    extraHeaders: {
                        hubtoken: this.token,
                    },
                },
            },
        });
        initListeners(socket, this);
        setTimeout(() => {
            if (this.state.accepted) {
                this.updatePreviousSelectedCells();
                this.registerCellToolbar();
                this.initJupyterBindings();
            }
        }, 100);
        this.setCallbacks();
        this.setState({socket});
        window.onbeforeunload = async () => {
            await this.loggingApi.logEvent(EventTypes.NOTEBOOK_CLOSED);
        };
    }

    render() {
        if (!this.state.accepted) return <></>;
        return <MainContext.Provider value={this.state}>
            {this.state.toggled ? <SideBarContainer>
                    <UntoggleButtonContainer>
                        <MinimizeIcon onClick={() => this.setToggled(false)}/>
                    </UntoggleButtonContainer>
                    <TabContainer>
                        <FlowchartButton onClick={() => this.setFlowchart(true)}
                                         flowChartenabled={this.state.flowchartOpened}>
                            <FlowchartIcon flowChartenabled={this.state.flowchartOpened}/>
                            Flowchart
                        </FlowchartButton>
                        <ChatButton onClick={() => this.setChat(true)} chatEnabled={this.state.chatOpened}>
                            <PeerShareIcon chatEnabled={this.state.chatOpened}/>
                            Discuss
                        </ChatButton>
                    </TabContainer>
                    {this.state.flowchartOpened ?
                        <FlowChart pair={this.state.pair} iPython={this.iPython} loggingApi={this.loggingApi}
                                   socket={this.state.socket}/> : (this.state?.pair !== null ?
                            <Chat/> :
                            <NoPair>
                                <NoPairIcon/>
                                No pair available, please wait
                            </NoPair>)}
                </SideBarContainer> : <ToggleButton/>}
        </MainContext.Provider>;
    }
}
