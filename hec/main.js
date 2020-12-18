define([
    "module",
    "require",
    "base/js/namespace",
], function (
    module,
    requirejs,
    Jupyter,
) {
    function load_notebook_extension() {
        requirejs()
    }


    return {
        load_ipython_extension: load_notebook_extension
    };
});
