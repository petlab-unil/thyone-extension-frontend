import React from 'react';
import ReactDOM from 'react-dom';
import {Extension} from '~components/extension';
import * as dotenv from 'dotenv';

dotenv.config();

window.define([
    'base/js/namespace',
], function (
    IPython,
) {
    const getTokenFromPython = () => {
        return new Promise((resolve) => {
            const callbacks = {
                iopub: {
                    output: (data) => resolve(data.content.text.trim())
                }
            };
            IPython.notebook.kernel.execute('import os;print(os.getenv("JUPYTERHUB_API_TOKEN"))', callbacks);
        });
    };

    const initialize = async () => {
        const div = document.createElement('div');
        div.id = 'react-root';
        const HUB_BASE_PATH = process.env.HUB_PATH;
        const token = await getTokenFromPython();
        const req = await fetch(`${HUB_BASE_PATH}/user`, {
            headers: {
                Authorization: `token ${token}`
            }
        });
        const user = await req.json();
        console.log(user);
        document.body.prepend(div);
        ReactDOM.render(<Extension iPython={IPython} userName={user.name} token={token} />, div);
    };

    const initExtension = () => {
        return IPython.notebook.config.loaded.then(initialize);
    };

    return {
        load_ipython_extension: initExtension,
    };
});