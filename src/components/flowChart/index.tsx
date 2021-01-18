import React, {ChangeEvent, Component} from 'react';
import Tree from 'react-d3-tree';
import {CustomNodeElementProps, RawNodeDatum, TreeNodeDatum} from 'react-d3-tree/lib/types/common';
import {FlowChartForm, FlowChartGrid, FlowChartSVG} from './styledComponents';

interface FlowNode extends RawNodeDatum {
    name: string,
    attributes?:
        {
            _id: string,
            [key: string]: string,
        },
    children?: FlowNode[],
}

interface FlowChartState {
    tree: FlowNode,
    selected: FlowNode | null,
    selectedParent: FlowNode | null,
}

export class FlowChart extends Component<{}, FlowChartState> {
    private currentNodeId = 0;
    private tree = {
        name: 'root',
        attributes: {
            _id: (this.currentNodeId++).toString(10),
            description: 'Beginning of the program',
        },
        children: [],
    };

    public state: FlowChartState = {
        tree: {...this.tree},
        selected: null,
        selectedParent: null,
    };

    /**
     *
     * @param node - Node at the beginning of the tree to search in
     * @param searchedId - Id of wanted node
     */
    private static findNodeAndParent = (node: FlowNode, searchedId: string): [FlowNode | null, FlowNode | null] => {
        const id = node.attributes?._id;
        if (id === undefined) {
            return [null, null];
        }
        if (id === searchedId) return [null, node];
        for (const child of node.children ?? []) {
            const searched = FlowChart.findNodeAndParent(child, searchedId);
            if (searched[1] !== null) {
                if (searched[0] === null) {
                    searched[0] = node;
                }
                return searched;
            }
        }
        return [null, null];
    }

    private static findLeaves = (node: FlowNode): FlowNode[] => {
        if (node.children === undefined || node.children.length === 0) return [node];
        const ret = [];
        for (const child of node.children) {
            ret.push(...FlowChart.findLeaves(child));
        }
        return ret;
    }

    private onNodeClick = (node: TreeNodeDatum) => {
        const searchedId = node.attributes?._id;
        if (searchedId === undefined) {
            this.setState({selected: null});
            return;
        }
        const [selectedParent, selected] = FlowChart.findNodeAndParent(this.tree, searchedId);
        if (selected === this.state.selected) {
            this.setState({selected: null, selectedParent: null});
        } else {
            this.setState({selectedParent, selected});
        }
    }

    private renderNodeWithCustomEvents = ({
                                              nodeDatum,
                                          }: CustomNodeElementProps): JSX.Element => {
        const _id = nodeDatum.attributes?._id;
        const fill = (_id !== undefined && this.state.selected?.attributes?._id === _id) ? 'red' : 'black';
        return (
            <g>
                <circle r="15" fill={fill} onClick={() => this.onNodeClick(nodeDatum)}/>
                <text fill="black" strokeWidth="1" x="20">
                    {nodeDatum.name}
                </text>
                {nodeDatum.attributes?.description && nodeDatum.attributes.description.length > 0 && (
                    <text fill="black" x="20" dy="20" strokeWidth="1">
                        {nodeDatum.attributes?.description}
                    </text>
                )}
            </g>
        );
    }

    private updateName = (e: ChangeEvent<HTMLInputElement>) => {
        e.stopPropagation();
        e.preventDefault();
        if (this.state.selected !== null) {
            this.state.selected.name = e.target.value;
            this.setState({selected: this.state.selected, tree: {...this.tree}});
        }
    }

    private updateDescription = (e: ChangeEvent<HTMLInputElement>) => {
        e.stopPropagation();
        e.preventDefault();
        if (this.state.selected !== null && this.state.selected.attributes) {
            this.state.selected.attributes.description = e.target.value;
            this.setState({selected: this.state.selected, tree: {...this.tree}});
        }
    }

    private addChild = () => {
        if (this.state.selected !== null && this.state.selected.attributes) {
            this.state.selected.children?.push({
                attributes: {_id: (this.currentNodeId++).toString(10), description: ''},
                children: [],
                name: '',
            });
            this.setState({selected: this.state.selected, tree: {...this.tree}});
        }
    }

    private converge = () => {
        if (this.state.selected === null) return;
        const leaves = FlowChart.findLeaves(this.state.selected);
        const newNode: FlowNode = {
            attributes: {_id: (this.currentNodeId++).toString(10)},
            children: [],
            name: '',
        };
        leaves.forEach(leave => leave.children?.push(newNode));
        this.setState({tree: {...this.tree}});
    }

    private removeNode = () => {
        if (this.state.selectedParent && this.state.selected) {
            const index = this.state.selectedParent.children?.indexOf(this.state.selected);
            if (index === undefined) {
                this.setState({selectedParent: null, selected: null, tree: {...this.tree}});
                return;
            }
            this.state.selectedParent.children?.splice(index, 1);
            this.setState({selectedParent: null, selected: null, tree: {...this.tree}});
        }
    }

    render(): React.ReactNode {
        return <FlowChartGrid>
            <FlowChartForm>
                {this.state.selected && <>
                    <label htmlFor="node-name">Name</label>
                    <input id="node-name" type="text" value={this.state.selected?.name} onChange={this.updateName}
                           onKeyDown={e => e.stopPropagation()}/>
                    <br/>
                    <label htmlFor="node-description">Description</label>
                    <input id="node-description" type="text" value={this.state.selected?.attributes?.description}
                           onChange={this.updateDescription}
                           onKeyDown={e => e.stopPropagation()}/>
                    <br/>
                    <button onClick={this.addChild}>Add child</button>
                    <button onClick={this.converge}>Converge</button>
                    {this.state.selectedParent && <button onClick={this.removeNode}>Remove node</button>}
                </>}
            </FlowChartForm>
            <FlowChartSVG>
                <Tree renderCustomNodeElement={(rd3tProps: CustomNodeElementProps) =>
                    this.renderNodeWithCustomEvents({...rd3tProps})
                } collapsible={false} data={this.state.tree} orientation={'vertical'}/>
            </FlowChartSVG>
        </FlowChartGrid>;
    }
}
