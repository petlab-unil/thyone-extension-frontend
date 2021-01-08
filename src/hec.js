import React from "react";
import ReactDOM from "react-dom";
import {Extension} from "~components/extension";
import * as dotenv from 'dotenv';
dotenv.config();

window.define([
    "base/js/namespace",
], function (
    IPython,
) {
    const initialize = async () => {
        const div = document.createElement("div");
        div.id = "react-root";
        const HUB_BASE_PATH = process.env.HUB_PATH;
        const req = await fetch(`${HUB_BASE_PATH}/user`);
        const user = await req.json();

        document.body.prepend(div);
        ReactDOM.render(<Extension iPython={IPython} userName={user.name}/>, div);
    };

    const initExtension = () => {
        return IPython.notebook.config.loaded.then(initialize);
    };

    return {
        load_ipython_extension: initExtension,
    };
});