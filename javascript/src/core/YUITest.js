

/**
 * YUI Test Framework
 */

/*
 * The root namespace for YUI Test.
 */

//So we only ever have one YUITest object that's shared
if (YUI.YUITest) {
    Y.Test = YUI.YUITest;
} else { //Ends after the YUITest definitions

    //Make this global for back compat
    YUITest = {
        version: "@VERSION@",
        _idx: 0,
        guid: function(pre) {
            var id = (new Date()).getTime() + '_' + (++YUITest._idx);
            return (pre) ? (pre + id) : id;
        }
    };
