import React, {ChangeEvent, Component} from 'react';
// @ts-ignore
import Graph from 'react-graph-vis';
import {
    ActionButton,
    ActionInput,
    ConnectingText,
    FlowChartForm,
    FlowChartButtonContainer,
    EdgeActionButtonContainer,
    FlowChartGrid,
    EdgeActionInput,
    FlowChartSVG,
    LonelyActionButton,
    LonelyActionButtonIcon,
    LonelyActionButtonIconText,
    AddNodeIcon,
    RemoveNodeIcon,
    ConnectNodeIcon,
    AddIconText,
    RemoveIconText,
    ConnectIconText,
    FlowchartShareButton,
    FlowchartShareIcon,
} from './styledComponents';
import {IPython} from '~iPythonTypes';
import {options} from '~components/flowChart/config';

interface FlowNode {
    id: number,
    label: string,
    title: string,
}

interface FlowEdge {
    from: number,
    to: number,
    label: string,
    id?: string,
}

interface FlowGraph {
    nodes: FlowNode[],
    edges: FlowEdge[],
}

interface FlowChartProps {
    iPython: IPython,
    socket: SocketIOClient.Socket | null,
    pair: string | null,
}

interface FlowChartState {
    graph: FlowGraph,
    selectedNode: FlowNode | null,
    selectedEdge: FlowEdge | null,
    connecting: boolean,
    pair: string | null,
}

export class FlowChart extends Component<FlowChartProps, FlowChartState> {
    private currentNodeId = 0;
    private readonly graph: FlowGraph;
    public state: FlowChartState;
    private iPython: IPython;
    private readonly socket: SocketIOClient.Socket | null;

    constructor({iPython, socket, pair}: FlowChartProps) {
        super({iPython, socket, pair});
        this.iPython = iPython;
        this.socket = socket;
        this.graph = this.iPython.notebook.metadata.graph ?? {
            nodes: [
                {
                    id: this.currentNodeId++,
                    label: 'Beginning of the program',
                    title: 'root',
                },
            ],
            edges: [],
        };
        this.currentNodeId = this.graph.nodes.reduce((current, {id}) => current > id ? current : id, -1) + 1;
        this.state = {
            pair,
            graph: this.cloneGraph(),
            selectedNode: null,
            connecting: false,
            selectedEdge: null,
        };
    }

    public componentWillReceiveProps({pair}: Readonly<FlowChartProps>): void {
        this.setState({pair});
    }

    public setState<K extends keyof FlowChartState>(state: ((prevState: Readonly<FlowChartState>, props: Readonly<FlowChartProps>) => (Pick<FlowChartState, K> | FlowChartState | null)) | Pick<FlowChartState, K> | FlowChartState | null, callback?: () => void): void {
        super.setState(state, () => {
            if (callback) callback();
            this.iPython.notebook.metadata.graph = this.state.graph;
        });
    }

    private cloneGraph = (): FlowGraph => {
        return {
            nodes: this.graph.nodes.map(({id, title, label}) => ({id, title, label})),
            edges: this.graph.edges.map(({from, to, label}) => ({from, to, label})),
        };
    }

    /**
     *
     * @param searchedId - Id of wanted node
     */
    private findNode = (searchedId: number): FlowNode | undefined => {
        return this.graph.nodes.find(({id}) => id === searchedId);
    }

    private selectNode = async (nodeId: number) => {
        const node = this.findNode(nodeId);
        if (node === undefined) {
            this.setState({selectedNode: null, connecting: false, selectedEdge: null});
        } else {
            await this.setState({selectedNode: node, connecting: false, selectedEdge: null});
            const input: HTMLInputElement | null = document.querySelector('#node-description');
            if (!input?.onfocus) input?.focus();
        }
    }

    private updateLabel = (e: ChangeEvent<HTMLInputElement>) => {
        e.stopPropagation();
        e.preventDefault();
        if (this.state.selectedNode !== null) {
            this.state.selectedNode.label = e.target.value;
            this.setState({
                selectedNode: this.state.selectedNode,
                graph: this.cloneGraph(),
            });
        }
    }

    private updateEdgeTitle = (e: ChangeEvent<HTMLInputElement>) => {
        e.stopPropagation();
        e.preventDefault();
        if (this.state.selectedEdge !== null) {
            const {selectedEdge} = this.state;
            if (selectedEdge === null) {
                this.setState({
                    selectedEdge: null,
                });
                return;
            }
            const graphEdge = this.graph.edges.find(({from, to}) => from === selectedEdge.from && to === selectedEdge.to);
            if (graphEdge === undefined) {
                this.setState({
                    selectedEdge: null,
                });
                return;
            }
            graphEdge.label = e.target.value.toString();
            this.state.selectedEdge.label = e.target.value.toString();
            this.setState({
                selectedEdge: this.state.selectedEdge,
                graph: this.cloneGraph(),
            });
        }
    }

    private addChild = async () => {
        const newNode: FlowNode = {
            id: this.currentNodeId++,
            label: '',
            title: '',
        };
        this.graph.nodes.push(newNode);
        if (this.state.selectedNode !== null) {
            const newEdge: FlowEdge = {
                from: this.state.selectedNode.id,
                to: newNode.id,
                label: '',
            };
            this.graph.edges.push(newEdge);
        }
        await this.setState({
            graph: this.cloneGraph(),
        });
    }

    private removeNode = () => {
        if (this.state.selectedNode === null || this.state.selectedNode.id === 0) return;
        const {id} = this.state.selectedNode;
        this.graph.edges = this.graph.edges.filter(({from, to}) => from !== id && to !== id);
        this.graph.nodes = this.graph.nodes.filter(node => node.id !== id);
        this.setState({
            graph: this.cloneGraph(),
            selectedNode: null,
        });
    }

    private connect = (id: number) => {
        if (!this.state.selectedNode) {
            this.setState({connecting: false});
            return;
        }
        const newEdge: FlowEdge = {
            from: this.state.selectedNode.id,
            to: id,
            label: '',
        };
        this.graph.edges.push(newEdge);
        this.setState({connecting: false, graph: this.cloneGraph()});
    }

    private startConnecting = () => {
        if (this.state.graph.nodes.length <= 1) return;
        this.setState({connecting: true});
    }

    private stopConnecting = () => {
        if (this.state.graph.nodes.length <= 1) return;
        this.setState({connecting:false});

    }

    private deleteEdge = () => {
        this.graph.edges = this.graph.edges.filter(({
                                                        from,
                                                        to,
                                                    }) => from !== this.state.selectedEdge?.from || to !== this.state.selectedEdge?.to);
        this.setState({selectedEdge: null, graph: this.cloneGraph()});
    }

    private clickedNode = async (selected: number) => {
        if (this.state.connecting) {
            this.connect(selected);
        } else {
            await this.selectNode(selected);
        }
    }

    private clickedEdge = (selected: string) => {
        if (this.state.connecting) return;
        const edge = this.state.graph.edges.find(({id}) => id === selected);
        if (edge !== undefined) {
            this.setState({selectedNode: null, selectedEdge: edge});
            const input: HTMLInputElement | null = document.querySelector('#node-description');
            if (!input?.onfocus) input?.focus();
        } else {
            this.setState({selectedEdge: null});
        }
    }

    private shareFlowChart = () => {
        if (this.socket === null) throw new Error('Socket is null');
        this.socket.emit('flowChart', JSON.stringify(this.graph));
    }

    render(): React.ReactNode {
        const events = {
            click: async ({nodes, edges}: { nodes: number[], edges: string[] }) => {
                if (nodes.length === 1) {
                    const selected = nodes[0];
                    await this.clickedNode(selected);
                } else if (edges.length === 1 && nodes.length === 0) {
                    const selected = edges[0];
                    this.clickedEdge(selected);
                } else {
                    this.setState({selectedNode: null, selectedEdge: null});
                    if (this.state.connecting && !this.state.selectedNode) {
                        this.stopConnecting();
                    }
                }
            },
        };

        return <FlowChartGrid>
            <FlowChartForm>
                { !this.state.selectedEdge && <>
                    <FlowChartButtonContainer>
                        <ActionButton onClick={this.addChild}>
                            <AddNodeIcon/>
                            <AddIconText>Create</AddIconText>
                        </ActionButton>
                        <ActionButton onClick={this.startConnecting}
                                      disabled={this.state.graph.nodes.length <= 1 || !this.state.selectedNode}>
                            <ConnectNodeIcon disabled={this.state.graph.nodes.length <= 1 || !this.state.selectedNode}/>
                            <ConnectIconText>Link</ConnectIconText>
                        </ActionButton>
                        <ActionButton onClick={this.removeNode}
                                      disabled={!this.state.selectedNode || this.state.selectedNode.id === 0}>
                            <RemoveNodeIcon disabled={!this.state.selectedNode || this.state.selectedNode.id === 0}/>
                            <RemoveIconText>Remove</RemoveIconText>
                        </ActionButton>
                    </FlowChartButtonContainer>
                    <ActionInput id="node-description" type="text"
                                 value={!this.state.selectedNode ? '' : this.state.selectedNode?.label}
                                 onChange={this.updateLabel}
                           onKeyDown={e => e.stopPropagation()} placeholder={'Select node to write description'}/>
                    <ConnectingText isVisible={this.state.connecting}>Select a node to link with</ConnectingText>
                </>}
                {
                    this.state.selectedEdge && <>
                        <EdgeActionButtonContainer>
                            <LonelyActionButton onClick={this.deleteEdge}>
                                <LonelyActionButtonIcon/>
                                <LonelyActionButtonIconText>Delete edge</LonelyActionButtonIconText>
                            </LonelyActionButton>
                            <EdgeActionInput id="node-description" type="text" value={this.state.selectedEdge.label}
                                         onChange={this.updateEdgeTitle}
                                         onKeyDown={e => e.stopPropagation()} placeholder={'Write edge description here'}/>
                        </EdgeActionButtonContainer>
                    </>
                }
            </FlowChartForm>
            <FlowChartSVG>
                <Graph graph={this.state.graph} events={events} options={options}/>
            </FlowChartSVG>
            {this.state.pair &&
            <FlowchartShareButton onClick={this.shareFlowChart}>
                <FlowchartShareIcon/> Share flowchart with {this.state.pair}
            </FlowchartShareButton>}
        </FlowChartGrid>;
    }
}
