export const options = {
    physics: {
        enabled: true,
        maxVelocity: 25,
    },
    layout: {
        hierarchical: {
            enabled: true,
            direction: 'UD',
        },
    },
    edges: {
        color: '#161b22',
    },
    nodes: {
        color: {
            background: '#ffe7e0',
            border: '#ff6e402b',
            highlight: {
                background: '#ffe7e0',
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
    height: 'calc(100% - 80px)',
};
