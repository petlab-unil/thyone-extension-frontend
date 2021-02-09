export const options = {
    physics:{
        enabled: false,
    },
    layout: {
        hierarchical: {
            direction: 'UD',
            sortMethod: 'hubsize',
            nodeSpacing: 300,
            levelSeparation: 200,
            treeSpacing: 300,
            edgeMinimization: false,
        },
    },
    edges: {
        color: '#161b22',
        smooth: {
            enabled: true,
            forceDirection: true,
        },
        selfReferenceSize:30,
        font:{
            align: 'horizontal',
        },
    },
    nodes: {
        color: {
            background: '#ffe7e0',
            border: '#ff6e402b',
            highlight: {
                background: '#ffd1c3',
                border: '#ff6e40',
            },
            hover: {
                background: '#ffe7e0',
                border: '#ff6e40',
            },
        },
        heightConstraint: {
            minimum: 50,
        },
        widthConstraint: {
            minimum: 150,
        },
        shape: 'box',
        shapeProperties: {
            borderRadius: 3,
        },
    },
    interaction:{
        hover: true,
        dragNodes: true,
    },
    height: 'calc(100% - 15px)',
};
