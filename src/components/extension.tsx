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
import {Minimize} from'@styled-icons/feather/Minimize';
import {
    TabContainer,
    FlowchartButton,
    FlowchartIcon,
    ChatButton,
    PeerShareIcon,
} from './tabComponents';

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
    padding: 10px;
    border-radius: 10px;
`;

interface ExtensionProps {
    iPython: IPython,
    userName: string,
    token: string
}

export class Extension extends Component<ExtensionProps, GlobalState> {
    state: GlobalState;
    private readonly iPython: IPython;
    private readonly token: string;

    constructor(props: ExtensionProps) {
        super(props);
        this.iPython = props.iPython;
        this.token = props.token;

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
        };
    }
    private setChat = (chatFlag: boolean) => {
        this.setState({flowchartOpened: !chatFlag, chatOpened: chatFlag});
    }

    private setFlowchart = (flowchartFlag: boolean) => {
        this.setState({flowchartOpened: flowchartFlag, chatOpened: !flowchartFlag});
    }

    private setToggled = (toggled: boolean) => {
        this.setState({toggled});
    }

    public addMessage = (message: ChatMessage) => {
        this.setState(prev => ({...prev, messages: [...prev.messages, message]}));
    }

    public foundPair = ({userName, discussion}: PairedInitialData) => {
        console.log(userName, discussion);
        this.setState({pair: userName, messages: discussion.messages});
    }

    public pairDisconnected = () => {
        this.setState({pair: null, messages: []});
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

    private initJupyterBindings = () => {
        const shareSelectedCells = () => {
            this.state.selectedCells.forEach((cell) => {
                const {outerHTML} = cell.element[0];
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
        this.updatePreviousSelectedCells();
        this.registerCellToolbar();
        this.initJupyterBindings();
        this.setState({socket});
    }

    render() {
        return <MainContext.Provider value={this.state}>
            {this.state.toggled ? <SideBarContainer>
                <UntoggleButtonContainer>
                    <MinimizeIcon onClick={() => this.setToggled(false)} />
                </UntoggleButtonContainer>
                <TabContainer>
                    <FlowchartButton onClick={() => this.setFlowchart(true)} flowChartenabled={this.state.flowchartOpened}>
                        <FlowchartIcon flowChartenabled={this.state.flowchartOpened}/>
                        Flowchart
                    </FlowchartButton>
                    <ChatButton onClick={() => this.setChat(true)} chatEnabled={this.state.chatOpened}>
                        <PeerShareIcon chatEnabled={this.state.chatOpened}/>
                        Discuss
                    </ChatButton>
                </TabContainer>
                {this.state.flowchartOpened ? <FlowChart iPython={this.iPython}/> : (this.state?.pair !== null ? <Chat/> :
                    <NoPair>
                        <NoPairIcon/>
                        No pair availabe, please wait
                    </NoPair>)}
            </SideBarContainer> : <ToggleButton/>}
        </MainContext.Provider>;
    }
}
