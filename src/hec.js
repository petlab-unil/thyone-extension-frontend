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
        ReactDOM.render(<Extension />, div);
    };

    const load_ipython_extension = () => {
        return IPython.notebook.config.loaded.then(initialize);
    };

    return {
        load_ipython_extension: load_ipython_extension,
    };
});