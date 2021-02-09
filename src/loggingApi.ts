export enum EventTypes {
    FLOWCHART_EDITED = 'flowChartEdited',  // Done
    CELL_EXECUTED = 'cellExecuted',  // Done
    CELL_EDITED = 'cellEdited',  // Done
    CELL_CREATED = 'cellCreated',  // Done
    CELL_DELETED = 'cellDeleted',
    NOTEBOOK_OPENED = 'notebookOpened', // Done
    NOTEBOOK_CLOSED = 'notebookClosed',  // Done
    NOTEBOOK_SAVED = 'notebookSaved',
    EXTENSION_UNTOGGLED = 'extensionUntoggled',  // Done
    EXTENSION_TOGGLED = 'extensionToggled',  // Done
}

export class LoggingApi {
    constructor(private token: string, private notebookName: string) {
    }

    public logEvent = async (eventId: EventTypes) => {
        try {
            const body = {
                hubtoken: this.token,
                notebookName: this.notebookName,
            };
            const fetchOptions = {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            };
            await fetch(`${process.env.BACKEND_HTTP}/users/log/${eventId}`, fetchOptions);
        } catch (e) {
            console.error(e);
        }
    }
}
