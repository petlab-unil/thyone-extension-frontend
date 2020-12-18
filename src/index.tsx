import React from 'react';
import ReactDOM from 'react-dom';

const startApp = () => {
    const reactRoot = document.createElement("div");
    document.body.appendChild(reactRoot);

    ReactDOM.render(
        <div>Hello World</div>,
        reactRoot
    );
};

module.exports = {startApp};