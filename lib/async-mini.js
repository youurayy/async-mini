var global = typeof(global) !== 'undefined' ? global : {};
var process = typeof(process) !== 'undefined' ? process : {};
var next = global.setImmediate || process.nextTick || setTimeout;
var exprt = typeof(exports) !== 'undefined' ? exports : window;

exprt.series = function(funcs, cb) {
    var keys = Object.keys(funcs);
    var ress;
    if (funcs.length === undefined) {
        ress = {};
    } else {
        ress = [];
    }
    function run() {
        if(!keys.length)
            return cb(null, ress);
        var key = keys.shift();
        var func = funcs[key];
        func(function(err, res) {
            if(err)
                return cb(err, ress);
            ress[key] = res;
            next(run);
        });
    }
    run();
}

exprt.parallel = function(funcs, cb) {
    var c = typeof(funcs) === 'object' ?
        Object.keys(funcs).length : funcs.length;
    var errs = {};
    var has_errs = false;
    var ress = {};
    if(!c)
        cb(null, ress);
    for(var k in funcs) {
        (function() {
            var f = funcs[k];
            var id = k;
            next(function() {
                f(function(err, res) {
                    if(err) {
                        errs[id] = err.stack || err;
                        has_errs = true;
                    }
                    if(res !== undefined)
                        ress[id] = res;
                    c--;
                    if(c == 0)
                        cb(has_errs ? errs : null, ress);
                });
            });
        })();
    }
};
