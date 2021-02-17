type UtilsSetter = (cell: any, value: any) => void;
type UtilsGetter = (cell: any) => any;

export interface Cell {
    element: HTMLDivElement[]
}

interface Notebook {
    metadata: any;
    get_cells: () => any[];
    save_notebook: () => void;
}

interface CheckBoxUiGenerator {
}

export interface CellToolbarUtils {
    checkbox_ui_generator: (name: string, setter: UtilsSetter, getter: UtilsGetter) => CheckBoxUiGenerator
    input_ui_generator: (name: string, setter: UtilsSetter, getter: UtilsGetter) => void
    select_ui_generator: (name: string, setter: UtilsSetter, getter: UtilsGetter) => void
}

export interface CellToolbar {
    utils: CellToolbarUtils
    register_callback: (name: string, callback: CheckBoxUiGenerator, cellTypes: string) => void
    register_preset: (name: string, presetList: string[], notebook: Notebook) => void
    activate_preset: (name: string) => void
    global_show(): void;
}

export interface ButtonsGroup {
    label: string
    icon: string
    callback: () => void
}

export interface IPythonToolbar {
    add_buttons_group: (buttons: ButtonsGroup[]) => void
}

export interface IPython {
    CellToolbar: CellToolbar
    toolbar: IPythonToolbar
    notebook: Notebook
    notebook_name: string
}
