import {GlobalState, MainContext} from '~contexts/mainContext';
import React, {Component} from 'react';
import Styled from 'styled-components';
import SocketIOClient from 'socket.io-client';
import {initListeners} from '~websocketEvents/initListeners';
import {ChatMessage} from '~websocketEvents/types';
import {Chat} from '~components/chat';
import {NoPair} from '~components/chat/noPair';
import {Cell, IPython} from '~iPythonTypes';
import {ToggleButton} from '~components/toggleButton';

const UntoggleButton = Styled.div`
    height: 2em;
    line-height: 2em;
    width: 100%;
    float: right;
    cursor: pointer;
    background-color: #fff;
    text-align: center;
    padding-bottom: 2px;
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
        };
    }

    private setToggled = (toggled: boolean) => {
        this.setState({toggled});
    }

    public addMessage = (message: ChatMessage) => {
        this.setState(prev => ({...prev, messages: [...prev.messages, message]}));
    }

    public foundPair = (message: string) => {
        this.setState({pair: message});
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
        const socket = SocketIOClient(process.env.BACKEND_WS ?? '',  {
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
                <UntoggleButton onClick={() => this.setToggled(false)}>Untoggle</UntoggleButton>
                {this.state?.pair !== null ? <Chat/> :
                    <NoPair>You haven't been paired with anyone, wait for someone to log in</NoPair>}
            </SideBarContainer> : <ToggleButton/>}
        </MainContext.Provider>;
    }
}
