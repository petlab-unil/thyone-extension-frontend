import React from "react";
import ReactDOM from "react-dom";
import {Extension} from "~components/extension";
import * as dotenv from "dotenv";
import {EventTypes, LoggingApi} from "~loggingApi";

dotenv.config();

window.define([
    "base/js/namespace",
    "notebook/js/cell",
], function (
    IPython,
    {Cell},
) {
    const getTokenFromPython = () => {
        return new Promise((resolve) => {
            const callbacks = {
                iopub: {
                    output: (data) => resolve(data.content.text.trim())
                }
            };
            IPython.notebook.kernel.execute("import os;print(os.getenv(\"JUPYTERHUB_API_TOKEN\"))", callbacks);
        });
    };

    const waitForKernel = () => {
        return new Promise((resolve) => {
            const recursive = () => {
                setTimeout(() => {
                    if (IPython.notebook && IPython.notebook.kernel) {
                        resolve(true);
                    } else {
                        recursive();
                    }
                }, 100);
            }
            recursive();
        });
    };

    const initialize = async () => {
        try {
            window.env = {};
            window.env.BACKEND_WS = process.env.BACKEND_WS;
            window.env.HUB_PATH = process.env.HUB_PATH;
            window.env.BACKEND_HTTP = process.env.BACKEND_HTTP;
            const div = document.createElement("div");
            div.id = "react-root";
            const HUB_BASE_PATH = process.env.HUB_PATH;
            await waitForKernel();
            const token = await getTokenFromPython();
            const req = await fetch(`${HUB_BASE_PATH}/user`, {
                headers: {
                    Authorization: `token ${token}`
                }
            });
            const user = await req.json();
            console.log("User", user);
            const loggingApi = new LoggingApi(token, IPython.notebook.notebook_name);
            loggingApi.logEvent(EventTypes.NOTEBOOK_OPENED).then(() => {
            });
            const save_notebook = IPython.Notebook.prototype.save_notebook;
            // tslint:disable-next-line:no-this-assignment
            IPython.Notebook.prototype.save_notebook = async function () {
                save_notebook.call(this);
                await loggingApi.logEvent(EventTypes.NOTEBOOK_SAVED);
            };
            const delete_cell = IPython.Notebook.prototype.delete_cell;
            // tslint:disable-next-line:no-this-assignment
            IPython.Notebook.prototype.delete_cell = async function () {
                delete_cell.call(this);
                await loggingApi.logEvent(EventTypes.CELL_DELETED);
            };
            document.body.prepend(div);
            console.log("Rendering extension");
            ReactDOM.render(<Extension iPython={IPython} cell={Cell} userName={user.name} admin={user.admin}
                                       token={token}
                                       loggingApi={loggingApi}/>, div);
        }
        catch (e) {
            console.error("Failed to load extension, reason in next message: ");
            console.error(e);
        }
    };

    const initExtension = () => {
        return IPython.notebook.config.loaded.then(initialize);
    };

    return {
        load_ipython_extension: initExtension,
    };
});
