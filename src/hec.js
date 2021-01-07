import React from 'react';
import ReactDOM from 'react-dom';
import {Extension} from "~components/extension";

window.define([
    'base/js/namespace',
], function (
    IPython,
) {
    const initialize = () => {
        const div = document.createElement('div');
        div.id = 'react-root';

        document.body.prepend(div);
        ReactDOM.render(<Extension iPython={IPython} />, div);
    };

    const initExtension = () => {
        return IPython.notebook.config.loaded.then(initialize);
    };

    return {
        load_ipython_extension: initExtension,
    };
});