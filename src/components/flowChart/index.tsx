import React, {ChangeEvent, Component} from 'react';
// @ts-ignore
import Graph from 'react-graph-vis';
import {
    ActionButton,
    ActionInput,
    ConnectingText,
    FlowChartForm,
    FlowChartButtonContainer,
    FlowChartGrid,
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
    ShareButton,
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
}

export class FlowChart extends Component<FlowChartProps, FlowChartState> {
    private currentNodeId = 0;
    private readonly graph: FlowGraph;
    public state: FlowChartState;
    private iPython: IPython;
    private readonly socket: SocketIOClient.Socket | null;
    private readonly pair: string | null;

    constructor({iPython, socket, pair}: FlowChartProps) {
        super({iPython, socket, pair});
        this.iPython = iPython;
        this.socket = socket;
        this.pair = pair;
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
            graph: this.cloneGraph(),
            selectedNode: null,
            connecting: false,
            selectedEdge: null,
        };
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
            edges: this.graph.edges.map(({from, to}) => ({from, to})),
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

    private addChild = async () => {
        const newNode: FlowNode = {
            id: this.currentNodeId++,
            label: '',
            title: '',
        };
        this.graph.nodes.push(newNode);
        if (this.state.selectedNode !== null) {
            const newEdege: FlowEdge = {
                from: this.state.selectedNode.id,
                to: newNode.id,
            };
            this.graph.edges.push(newEdege);
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
        };
        this.graph.edges.push(newEdge);
        this.setState({connecting: false, graph: this.cloneGraph()});
    }

    private startConnecting = () => {
        if (this.state.graph.nodes.length <= 1) return;
        this.setState({connecting: true});
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
                }
            },
        };

        return <FlowChartGrid>
            <FlowChartForm>
                {!this.state.connecting && !this.state.selectedEdge && <>
                    <FlowChartButtonContainer>
                        <ActionButton onClick={this.addChild}>
                            <AddNodeIcon/>
                            <AddIconText>Create</AddIconText>
                        </ActionButton>
                        <ActionButton onClick={this.startConnecting} disabled={this.state.graph.nodes.length <= 1}>
                            <ConnectNodeIcon disabled={this.state.graph.nodes.length <= 1}/>
                            <ConnectIconText>Connect</ConnectIconText>
                        </ActionButton>
                        <ActionButton onClick={this.removeNode}
                                      disabled={!this.state.selectedNode || this.state.selectedNode.id === 0}>
                            <RemoveNodeIcon disabled={!this.state.selectedNode || this.state.selectedNode.id === 0}/>
                            <RemoveIconText>Remove</RemoveIconText>
                        </ActionButton>
                    </FlowChartButtonContainer>
                    <ActionInput id="node-description" type="text" value={this.state.selectedNode?.label}
                           onChange={this.updateLabel}
                           onKeyDown={e => e.stopPropagation()}/>
                </>}
                {
                    this.state.connecting &&
                    <ConnectingText>Select a node to connect</ConnectingText>
                }
                {
                    this.state.selectedEdge &&
                    <LonelyActionButton onClick={this.deleteEdge}>
                        <LonelyActionButtonIcon/>
                        <LonelyActionButtonIconText>Delete edge</LonelyActionButtonIconText>
                    </LonelyActionButton>
                }
            </FlowChartForm>
            <FlowChartSVG>
                <Graph graph={this.state.graph} events={events} options={options}/>
            </FlowChartSVG>
            {this.pair && <ShareButton onClick={this.shareFlowChart}>Share flowchart with {this.pair}</ShareButton>}
        </FlowChartGrid>;
    }
}
