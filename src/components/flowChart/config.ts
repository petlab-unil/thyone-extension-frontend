export const options = {
    physics:{
        enabled: false,
    },
    layout: {
        hierarchical: {
            direction: 'UD',
        },
    },
    edges: {
        color: '#161b22',
        smooth: true,
        selfReferenceSize: 40,
        font:{
            align: 'horizontal',
            vadjust: 38,
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
