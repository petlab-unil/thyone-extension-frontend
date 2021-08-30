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
import {AdminPage} from '~components/admin';
import {AdminPanelSettings} from '@styled-icons/material-rounded/AdminPanelSettings';
import {QueueStatus} from '../../../hec-extension-backend/src/websockets/types';
import * as dotenv from 'dotenv';
import {Agreement} from '~components/agreement';
import {fetchAgreement} from '~components/request';

dotenv.config();

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
const AdminPanelButton = Styled(AdminPanelSettings)`
    float: left;
    height: 20px;
    position: relative;
    top: 0px;
    color: #e7e7e7;
    cursor: pointer;
    margin-right: 5px;
    padding: 2.5px;
    stroke-width: 2.3px;
    &:hover {
       color: #ff6e40;
    }
`;

const AdminButton = Styled.div`
    width: 50px;
    Height: 30px;
    line-height:20px;
    float: left;
    color: #e7e7e7;
    cursor: pointer;
    margin-left: 5px;
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
    admin: boolean;
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
    private notificationsInterval: number | null;
    private interval: number = 0;
    private lastActivity: number = Date.now();
    private lastStatus: boolean = true;
    private agreement: boolean = false;

    constructor(props: ExtensionProps) {
        super(props);
        this.iPython = props.iPython;
        this.token = props.token;
        this.loggingApi = props.loggingApi;
        this.cell = props.cell;
        this.notificationsInterval = null;
        // @ts-ignore
        window.extension = this;

        this.state = {
            admin: props.admin,
            userName: props.userName,
            toggled: true,
            setToggled: this.setToggled,
            socket: null,
            pair: null,
            messages: [],
            selectedCells: new Set<Cell>(),
            chatOpened: false,
            setChat: this.setChat,
            adminOpened: false,
            setAdmin: this.setAdmin,
            flowchartOpened: true,
            setFlowchart: this.setFlowchart,
            accepted: false,
            queueStatus: {
                pairs: [],
                queue: [],
            },
            notifications: false,
            showExtension: false,
        };
    }

    private setAdmin = (adminFlag: boolean) => {
        this.setState({adminOpened: adminFlag});
    }

    private setChat = (chatFlag: boolean) => {
        if (this.notificationsInterval !== null) clearInterval(this.notificationsInterval);
        this.notificationsInterval = null;
        this.setState({flowchartOpened: !chatFlag, chatOpened: chatFlag, notifications: false});
        const chatElem = document.querySelector('#hec_chat_history_container');
        if (chatElem === null) return;
        chatElem.scrollTop = chatElem.scrollHeight;
    }

    private setFlowchart = (flowchartFlag: boolean) => {
        this.setState({flowchartOpened: flowchartFlag, chatOpened: !flowchartFlag});
        const chatElem = document.querySelector('#hec_chat_history_container');
        if (chatElem === null) return;
        chatElem.scrollTop = chatElem.scrollHeight;
    }

    private setToggled = async (toggled: boolean) => {
        this.setState({toggled});
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

    private blinkNotification = () => {
        if ((!this.state.chatOpened || !this.state.toggled) && this.notificationsInterval === null) {
            this.notificationsInterval = setInterval(() => {
                this.setState({notifications: !this.state.notifications});
            }, 1000);
        }
    }

    public addMessage = (message: ChatMessage) => {
        this.setState(prev => ({
            ...prev,
            messages: [...prev.messages, message],
            notifications: !this.state.chatOpened,
        }));
        this.blinkNotification();
        const chatElem = document.querySelector('#hec_chat_history_container');
        if (chatElem === null) return;
        chatElem.scrollTop = chatElem.scrollHeight;
    }

    public foundPair = ({userName, discussion}: PairedInitialData) => {
        this.state.socket?.emit('activity', 'active');
        this.setState({pair: userName, messages: discussion.messages});
        this.blinkNotification();
        const chatElem = document.querySelector('#hec_chat_history_container');
        if (chatElem === null) return;
        chatElem.scrollTop = chatElem.scrollHeight;
    }

    public pairDisconnected = () => {
        this.setState({pair: null, messages: []});
    }

    public setAccepted = (accepted: boolean) => {
        if (accepted && !this.state.accepted) {
            this.updatePreviousSelectedCells();
            this.registerCellToolbar();
            this.initJupyterBindings();
        }
        this.setState({accepted});
    }

    public setAdminQueue = (adminQueue: QueueStatus) => {
        this.setState({queueStatus: adminQueue});
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

    private unselectCells = () => {
        this.iPython.notebook.get_cells().forEach(cell => cell.celltoolbar.inner_element[0].firstChild.lastChild.lastChild.checked = '');
        this.setState({selectedCells: new Set<Cell>()});
    }

    private updatePreviousSelectedCells = () => {
        this.setState({selectedCells: new Set(this.iPython.notebook.get_cells().filter(cell => cell.metadata.hecSelected))});
    }

    private setCallbacks = () => {
        // tslint:disable-next-line:no-this-assignment
        const self = this;
        this.iPython.notebook.get_cells().forEach((cell: any) => {
            if (!cell || !cell.execute) return;
            const execute = cell.execute;
            const edit_mode = cell.edit_mode;
            cell.edit_mode = () => {
                edit_mode.apply(cell);
                self.loggingApi.logEvent(EventTypes.CELL_EDITED).then(() => {
                }).catch(err => console.error(err));
            };
            cell.execute = async () => {
                execute.apply(cell);
                await self.loggingApi.logEvent(EventTypes.CELL_EXECUTED);
            };
        });

        const create_element = this.cell.prototype.create_element;
        const edit_mode = this.cell.prototype.edit_mode;
        this.cell.prototype.create_element = function () {
            create_element.apply(this);
            self.loggingApi.logEvent(EventTypes.CELL_CREATED).then(() => {
            }).catch(err => console.error(err));
            this.edit_mode = function () {
                edit_mode.apply(this);
                self.loggingApi.logEvent(EventTypes.CELL_EDITED).then(() => {
                }).catch(err => console.error(err));
            };
            const execute = this.execute;
            this.execute = async function () {
                execute.apply(this);
                try {
                    await self.loggingApi.logEvent(EventTypes.CELL_EXECUTED);
                } catch (err) {
                    console.error(err);
                }
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
            this.unselectCells();
        };

        this.iPython.toolbar.add_buttons_group([
            {
                label: 'Share Selected Cells',
                icon: 'fas fa-share-square',
                callback: shareSelectedCells,
            },
        ]);
    }

    private recordActivity = () => {
        this.lastActivity = Date.now();
    }

    private pingActivity = () => {
        const diff = Date.now() - this.lastActivity < 10000;    // send if more than 10 sec inactivity
        if ((diff || this.lastStatus) && !(diff && this.lastStatus)) {
            this.state.socket?.emit('activity', diff ? 'active' : 'away');
            this.lastStatus = !this.lastStatus;
        }
    }

    private hideExtension = () => {
        this.setState({showExtension: false});
    }

    private loadExtension = () => {
        if (process.env.BACKEND_WS === undefined) {
            console.error('process.env.BACKEND_WS undefined');
            throw new Error('process.env.BACKEND_WS undefined');
        }
        const address = process.env.BACKEND_WS;
        const socket = SocketIOClient(address, {
            transportOptions: {
                polling: {
                    extraHeaders: {
                        hubtoken: this.token,
                    },
                },
            },
        });
        initListeners(socket, this);
        this.setCallbacks();
        this.setState({socket});
        window.onbeforeunload = async () => {
            await this.loggingApi.logEvent(EventTypes.NOTEBOOK_CLOSED);
        };
        window.onmouseover = async () => this.recordActivity();
        this.interval = setInterval(() => this.pingActivity(), 3000);  // check every 3 sec
    }

    public componentDidMount = async () => {
        try {
            const res = await fetchAgreement(this.state.userName);
            this.agreement = res.agreement;
            if (res.agreement) this.loadExtension();
            if (res.group === 'experimental') this.setState({showExtension: true});
        } catch (e) {
            console.error(e);
        }
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    render() {
        if (!this.state.accepted && this.state.showExtension) {
            return <MainContext.Provider value={this.state}>
                <Agreement hideExtension={this.hideExtension}
                           loadExtension={this.loadExtension}
                           agreement={this.agreement}/>
            </MainContext.Provider>;
        }
        if ((!this.state.accepted && !this.state.showExtension) || (this.state.accepted && !this.state.showExtension)) return <></>;
        return <MainContext.Provider value={this.state}>
            {this.state.toggled ? <SideBarContainer>
                <UntoggleButtonContainer>
                    <MinimizeIcon onClick={() => this.setToggled(false)}/>
                    {this.state.admin ?
                        <AdminButton onClick={() => this.setAdmin(true)}>
                            <AdminPanelButton/>
                        </AdminButton> : <></>}
                </UntoggleButtonContainer>
                <TabContainer>
                    <FlowchartButton onClick={() => {
                        this.setFlowchart(true);
                        this.setAdmin(false);
                    }}
                                     flowChartenabled={this.state.flowchartOpened}>
                        <FlowchartIcon flowChartenabled={this.state.flowchartOpened}/>
                        Flowchart
                    </FlowchartButton>
                    <ChatButton notifications={this.state.notifications} onClick={() => {
                        this.setChat(true);
                        this.setAdmin(false);
                    }} chatEnabled={this.state.chatOpened}>
                        <PeerShareIcon chatEnabled={this.state.chatOpened}/>
                        Discuss
                    </ChatButton>
                </TabContainer>
                {this.state.adminOpened ? <AdminPage/> : (this.state.flowchartOpened ?
                    <FlowChart pair={this.state.pair} iPython={this.iPython} loggingApi={this.loggingApi}
                               socket={this.state.socket}/> : (this.state?.pair !== null ? <Chat/> :
                        <NoPair>
                            <NoPairIcon/>
                            No pair available, please wait
                        </NoPair>))}
            </SideBarContainer> : <ToggleButton/>}
        </MainContext.Provider>;
    }
}
