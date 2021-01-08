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
    text-align: center;
    border-bottom: 1px solid black;
    padding-bottom: 2px;
    margin-bottom: 10px;
`;

const TOOLBAR_PRESET_NAME = 'Share Cell';

const SideBarContainer = Styled.div`
    width: 400px;
    height: calc(100% - 130px);
    right: 10px;
    top: 120px;
    position: fixed;
    background-color: #eeeeee;
    border: 1px solid #999;
    color: black;
    z-index: 100000;
    padding: 10px;
    border-radius: 10px;
`;

interface ExtensionProps {
    iPython: IPython
}

export class Extension extends Component<ExtensionProps, GlobalState> {
    state: GlobalState;
    private readonly iPython: IPython;

    constructor(props: ExtensionProps) {
        super(props);
        const path = window.location.href.split('/');
        const userName = path[path.indexOf('user') + 1];
        this.iPython = props.iPython;

        this.state = {
            userName,
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
        CellToolbar.activate_preset(TOOLBAR_PRESET_NAME);
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
        const socket = SocketIOClient(`ws://localhost:3000?user=${this.state.userName}`);
        initListeners(socket, this);
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
