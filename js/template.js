/**
 * @see https://github.com/cho45/micro-template.js
 * (c) cho45 http://cho45.github.com/mit-license
 */
var UI = {};
    UI.template = function(id, data) {
    var me = UI.template;

    if (!me.cache[id]) {
        me.cache[id] = (function() {
            var name = id;
            var string = /^[\w\-]+$/.test(id) ?
                me.get(id) : (name = 'template(string)', id); // no warnings

            var line = 1;
            /* eslint-disable max-len, quotes */
            var body = ('try { ' + (me.variable ?
                    'var ' + me.variable + ' = this.stash;' : 'with (this.stash) { ') +
                "this.ret += '" +
                string.
                replace(/<%/g, '\x11').replace(/%>/g, '\x13'). // if you want other tag, just edit this line
                replace(/'(?![^\x11\x13]+?\x13)/g, '\\x27').
                replace(/^\s*|\s*$/g, '').
                replace(/\n/g, function() {
                    return "';\nthis.line = " + (++line) + "; this.ret += '\\n";
                }).
                replace(/\x11-(.+?)\x13/g, "' + ($1) + '").
                replace(/\x11=(.+?)\x13/g, "' + this.escapeHTML($1) + '").
                replace(/\x11(.+?)\x13/g, "'; $1; this.ret += '") +
                "'; " + (me.variable ? "" : "}") + "return this.ret;" +
                "} catch (e) { throw 'TemplateError: ' + e + ' (on " + name +
                "' + ' line ' + this.line + ')'; } " +
                "//@ sourceURL=" + name + "\n" // source map
            ).replace(/this\.ret \+= '';/g, '');
            /* eslint-enable max-len, quotes */
            var func = new Function(body);
            var map = {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '\x22': '&#x22;',
                '\x27': '&#x27;'
            };
            var escapeHTML = function(string) {
                return ('' + string).replace(/[&<>\'\"]/g, function(_) {
                    return map[_];
                });
            };

            return function(stash) {
                return func.call(me.context = {
                    escapeHTML: escapeHTML,
                    line: 1,
                    ret: '',
                    stash: stash
                });
            };
        })();
    }

    return data ? me.cache[id](data) : me.cache[id];
};

UI.template.cache = {};

UI.template.get = function(id) {
    if (id) {
        var element = document.getElementById(id);
        return element && element.innerHTML || '';
    }
};