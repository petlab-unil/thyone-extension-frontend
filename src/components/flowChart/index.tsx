import React, {ChangeEvent, Component} from 'react';
// @ts-ignore
import Graph from 'react-graph-vis';
import {
    ActionButton,
    ConnectingText,
    FlowChartForm,
    FlowChartGrid,
    FlowChartSVG,
    LonelyActionButton,
} from './styledComponents';
import {IPython} from '~iPythonTypes';

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
}

interface FlowChartState {
    graph: FlowGraph,
    selectedNode: FlowNode | null,
    selectedEdge: FlowEdge | null,
    connecting: boolean,
}

export class FlowChart extends Component<FlowChartProps, FlowChartState> {
    private currentNodeId = 0;
    private graph: FlowGraph;
    public state: FlowChartState;
    private iPython: IPython;

    constructor({iPython}: FlowChartProps) {
        super({iPython});
        this.iPython = iPython;
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

    render(): React.ReactNode {
        const events = {
            selectNode: async ({nodes}: { nodes: number[], edges: string[] }) => {
                if (nodes.length === 1) {
                    const selected = nodes[0];
                    if (this.state.connecting) {
                        this.connect(selected);
                    } else {
                        await this.selectNode(selected);
                    }
                } else {
                    this.setState({selectedNode: null, selectedEdge: null});
                }
            },
            selectEdge: ({edges, nodes}: { nodes: number[], edges: string[] }) => {
                if (this.state.connecting) return;
                if (edges.length === 1 && nodes.length === 0) {
                    const selected = edges[0];
                    if (selected === undefined) return;
                    const edge = this.state.graph.edges.find(({id}) => id === selected);
                    if (edge !== undefined) {
                        this.setState({selectedNode: null, selectedEdge: edge});
                    } else {
                        this.setState({selectedEdge: null});
                    }
                } else {
                    this.setState({selectedEdge: null});
                }
            },
            deselectNode: () => {
                // Hack to be able to deselect when connecting, but have deselect fire after connection
                setTimeout(() => {
                    this.setState({selectedNode: null, connecting: false});
                }, 100);
            },
        };

        const options = {
            layout: {
                improvedLayout: true,
                hierarchical: true,
            },
            edges: {
                color: '#000000',
            },
            nodes: {
                color: 'lightgrey',
                shape: 'box',
                shapeProperties: {
                    borderRadius: 3,
                },
            },
            height: 'calc(100% - 80px)',
        };

        return <FlowChartGrid>
            <FlowChartForm>
                {!this.state.connecting && !this.state.selectedEdge && <>
                    <ActionButton onClick={this.addChild}>Add next step</ActionButton>
                    <ActionButton onClick={this.startConnecting} disabled={this.state.graph.nodes.length <= 1}>Connect
                        node</ActionButton>
                    <ActionButton onClick={this.removeNode}
                                  disabled={!this.state.selectedNode || this.state.selectedNode.id === 0}>Remove
                        step</ActionButton>
                    <input id="node-description" type="text" value={this.state.selectedNode?.label}
                           style={{width: 0, height: 0, border: 0, outlineWidth: 0}}
                           onChange={this.updateLabel}
                           onKeyDown={e => e.stopPropagation()}/>
                </>}
                {
                    this.state.connecting &&
                    <ConnectingText>Select other nodes to connect</ConnectingText>
                }
                {
                    this.state.selectedEdge &&
                    <LonelyActionButton onClick={this.deleteEdge}>Delete edge</LonelyActionButton>
                }
            </FlowChartForm>
            <FlowChartSVG>
                <Graph graph={this.state.graph} events={events} options={options}/>
            </FlowChartSVG>
        </FlowChartGrid>;
    }
}
