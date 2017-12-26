// webpack
/**
 * @see https://github.com/cho45/micro-template.js
 * (c) cho45 http://cho45.github.com/mit-license
 */
!(function () {
    UI = {};
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
})();
// colorSelect
/*! Amaze UI v2.7.2 | by Amaze UI Team | (c) 2016 AllMobilize, Inc. | Licensed under MIT | 2016-08-17T16:17:24+0800 */
!(function ($) {

    function Selecter(element, options) {
        this.$element = $(element);
        this.options = $.extend({}, Selecter.DEFAULTS, {}, options);
        this.$originalOptions = this.$element.find('option');
        this.multiple = element.multiple;
        this.$selector = null;
        this.initialized = false;
        this.init();
    }

    Selecter.DEFAULTS = {
        btnWidth: null,
        btnSize: null,
        btnStyle: 'default',
        dropUp: 0,
        maxHeight: null,
        maxChecked: null,
        placeholder: '点击选择...',
        selectedClass: 'selected',
        disabledClass: 'am-disabled',
        searchBox: false,
        id: "tmpl1",
        id2: "tmpl2",
        tpl: '<div class="am-selected mySelect ' +
        '<%= dropUp ? \'am-dropdown-up\': \'\' %>" id="<%= id %>" data-am-dropdown>' +
        '  <button type="button" class="am-selected-btn am-btn am-dropdown-toggle">' +
        '    <span class="button_color"></span>' +
        '    <span class="am-selected-status am-fl"></span>' +
        '    <img src="images/down.png" class="am-selected-icon am-icon-caret-' +
        '<%= dropUp ? \'up\' : \'down\' %>">' +
        '  </button>' +
        '  <div class="am-selected-content select_content">' +
        '    <h2 class="am-selected-header">' +
        '<span class="am-icon-chevron-left">返回</span></h2>' +
        '   <% if (searchBox) { %>' +
        '   <div class="am-selected-search">' +
        '     <input autocomplete="off" class="am-form-field am-input-sm" />' +
        '   </div>' +
        '   <% } %>' +
        '    <ul class="am-selected-list">' +
        '      <% for (var i = 0; i < options.length; i++) { %>' +
        '       <% var option = options[i] %>' +
        '       <% if (option.header) { %>' +
        '  <li data-group="<%= option.group %>" class="am-selected-list-header">' +
        '       <%= option.text %></li>' +
        '       <% } else { %>' +
        '       <li class="<%= option.classNames%>" ' +
        '         data-index="<%= option.index %>" ' +
        '         data-group="<%= option.group || 0 %>" ' +
        '         data-value="<%= option.value %>" >' +
        '         <span class="color" style="background: <%= option.color %>"></span>' +
        '         <span class="am-selected-text"><%= option.text %></span>' +
        '      <% } %>' +
        '      <% } %>' +
        '    </ul>' +
        '    <div class="am-selected-hint"></div>' +
        '  </div>' +
        '</div>',
        listTpl:   '<% for (var i = 0; i < options.length; i++) { %>' +
        '       <% var option = options[i] %>' +
        '       <% if (option.header) { %>' +
        '  <li data-group="<%= option.group %>" class="am-selected-list-header">' +
        '       <%= option.text %></li>' +
        '       <% } else { %>' +
        '       <li class="<%= option.classNames %>" ' +
        '         data-index="<%= option.index %>" ' +
        '         data-group="<%= option.group || 0 %>" ' +
        '         data-value="<%= option.value %>" >' +
        '         <span class="color" style="background: <%= option.color %>"></span>' +
        '         <span class="am-selected-text"><%= option.text %></span>' +
        '      <% } %>' +
        '      <% } %>'
    };

    Selecter.prototype.init = function() {
        var _this = this;
        var $element = this.$element;
        var options = this.options;
        $element.hide();
        var data = {
            id:this.generates('am-selected'),
            multiple: this.multiple,
            options: [],
            searchBox: options.searchBox,
            dropUp: options.dropUp,
            placeholder: options.placeholder
        };
        this.$selector = $(UI.template(this.options.tpl, data));
        // set select button styles
        this.$selector.css({width: this.options.btnWidth});
        this.$list = this.$selector.find('.am-selected-list');
        this.$searchField = this.$selector.find('.am-selected-search input');
        this.$hint = this.$selector.find('.am-selected-hint');

        var $selectorBtn = this.$selector.find('.am-selected-btn');
        var btnClassNames = [];

        options.btnSize && btnClassNames.push('am-btn-' + options.btnSize);
        options.btnStyle && btnClassNames.push('am-btn-' + options.btnStyle);
        $selectorBtn.addClass(btnClassNames.join(' '));
        // $(this.$selector).after($(this.$element));
        // disable Selecter instance if <selected> is disabled
        // should call .disable() after Dropdown initialed
        if ($element[0].disabled) {
            this.disable();
        }

        // set list height
        if (options.maxHeight) {
            this.$selector.find('.am-selected-list').css({
                'max-height': options.maxHeight,
                'overflow-y': 'scroll'
            });
        }

        // set hint text
        var hint = [];
        var min = $element.attr('minchecked');
        var max = $element.attr('maxchecked') || options.maxChecked;

        this.maxChecked = max || Infinity;

        if ($element[0].required) {
            hint.push('必选');
        }

        if (min || max) {
            min && hint.push('至少选择 ' + min + ' 项');
            max && hint.push('至多选择 ' + max + ' 项');
        }

        this.$hint.text(hint.join('，'));

        // render dropdown list
        this.renderOptions();

        // append $selector after <select>
        this.$element.after(this.$selector);
        this.dropdown = this.$selector.find('.am-selected-content');
        this.$color = this.$selector.find('.button_color');
        this.$status = this.$selector.find('.am-selected-status');
        // #try to fixes #476
        setTimeout(function() {
            _this.syncData();
            _this.initialized = true;
        }, 0);
        this.bindEvents();
    };

    Selecter.prototype.generates = function(namespace) {
        var uid = namespace + '-' || 'am-';

        do {
            uid += Math.random().toString(36).substring(2, 7);
        } while (document.getElementById(uid));

        return uid;
    };

    Selecter.prototype.renderOptions = function() {
        var $element = this.$element;
        var options = this.options;
        var optionItems = [];
        var $optgroup = $element.find('optgroup');
        this.$originalOptions = this.$element.find('option');

        // 单选框使用 JS 禁用已经选择的 option 以后，
        // 浏览器会重新选定第一个 option，但有一定延迟，致使 JS 获取 value 时返回 null
        if (!this.multiple && ($element.val() === null)) {
            this.$originalOptions.length &&
            (this.$originalOptions.get(0).selected = true);
        }

        function pushOption(index, item, group, color) {
            if (item.value === '') {
                // skip to next iteration
                // @see http://stackoverflow.com/questions/481601/how-to-skip-to-next-iteration-in-jquery-each-util
                return true;
            }

            var classNames = '';
            item.disabled && (classNames += options.disabledClass);
            !item.disabled && item.selected && (classNames += options.selectedClass);

            optionItems.push({
                color:color,
                group: group,
                index: index,
                classNames: classNames,
                text: item.text,
                value: item.value
            });
        }

        // select with option groups
        if ($optgroup.length) {
            $optgroup.each(function(i) {
                // push group name
                optionItems.push({
                    header: true,
                    group: i + 1,
                    text: this.label
                });

                $optgroup.eq(i).find('option').each(function(index, item) {
                    pushOption(index, item, i,null);
                });
            });
        } else {
            // without option groups
            this.$originalOptions.each(function(index, item) {
                var $color = item.getAttribute("data-color")||"#fff";
                pushOption(index, item, null,$color);
            });
        }

        this.$list.html(UI.template(options.listTpl, {options: optionItems}));
        this.$shadowOptions = this.$list.find('> li').
        not('.am-selected-list-header');
    };

    Selecter.prototype.setChecked = function(item) {

        var options = this.options;
        var $item = $(item);
        var isChecked = $item.hasClass(options.selectedClass);

        if (this.multiple) {
            // multiple
            var checkedLength = this.$list.find('.' + options.selectedClass).length;

            if (!isChecked && this.maxChecked <= checkedLength) {
                this.$element.trigger('checkedOverflow.selected.amui', {
                    selected: this
                });

                return false;
            }
        } else {
            // close dropdown whether item is checked or not
            // @see #860


            if (isChecked) {
                return false;
            }

            this.$shadowOptions.not($item).removeClass(options.selectedClass);
        }

        $item.toggleClass(options.selectedClass);
        this.syncData(item);
    };

    Selecter.prototype.syncData = function(item) {
        var _this = this;
        var options = this.options;
        var status = [];
        var $checked = $([]);
        var $style;

        this.$shadowOptions.filter('.' + options.selectedClass).each(function() {
            var $this = $(this);
            status.push($this.find('.am-selected-text').text());
            $style =  $this.find(".color").attr("style");
            if (!item) {
                $checked = $checked.add(_this.$originalOptions
                    .filter('[value="' + $this.data('value') + '"]')
                    .prop('selected', true));
            }
        });

        if (item) {
            var $item = $(item);
            this.$originalOptions
                .filter('[value="' + $item.data('value') + '"]')
                .prop('selected', $item.hasClass(options.selectedClass));
        } else {
            this.$originalOptions.not($checked).prop('selected', false);
        }

        // nothing selected
        if (!this.$element.val()) {
            status = [options.placeholder];
        }
        this.$color.attr("style",$style);
        this.$status.text(status.join(', '));

        // Do not trigger change event on initializing
        this.initialized && this.$element.trigger('change');
    };

    Selecter.prototype.bindEvents = function() {
        var _this = this;
        var header = 'am-selected-list-header';
        this.$list.on('click', '> li', function(e) {
            var $this = $(this);
            !$this.hasClass(_this.options.disabledClass) &&
            !$this.hasClass(header) && _this.setChecked(this);
            _this.dropdown.hide();
            e.stopPropagation();
        });
        this.$selector.on("click",function (e) {
            $(this).find(".am-selected-content.select_content").toggle();

        });

    };

    $.fn.Selecter = function () {
        this.each(function (i,el) {
            new Selecter(el);
        })
    }
})(jQuery);
//
window.onload = function () {
    $('select[data-my-selected]').Selecter();
};
