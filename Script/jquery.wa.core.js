$.wa = {};
(function ($) {
    var div = document.createElement("div");
    $.wa.support = {};
    $.wa.support.selectstart = "onselectstart" in div;
})($);
$.fn.disableSelection=function() {
    return this.bind( ( $.wa.support.selectstart ? "selectstart" : "mousedown" ) +
        ".wa-disableSelection", function( event ) {
            event.preventDefault();
        });
};
$.fn.enableSelection = function () {
    return this.unbind(".wa-disableSelection");
}
//$.wa.guid = function () {
//    var now = new Date();
//    return '' + now.getFullYear() + now.getMonth() + now.getDate() + now.getHours() + now.getMinutes() + now.getSeconds() + now.getMilliseconds() + parseInt($.guid++);
//}
$.wa.guid = 1;
$.wa.overlayZindex = 1;
$.wa.base = function (options, element) {
    if (arguments.length) {
        this._initial(options, element);
    }
}
$.wa.base.prototype = {
    options: {},
    element: null,
    name: 'base',
    ui:{},
    _initial: function (options, element) {
        this.options = $.extend({}, this.options, options);
        this.element = $(element);
        this._create();
    },
    _create:function(){
    },
    _reset:function(){
    },
    _setOption: function (options) {
        this.options = $.extend(this.options, options);
        this._reset();
    },
    option: function (option) {
        if (!option) {
            return this.options;
        }
        if (typeof option == 'string') {
            return this.options[option];
        }
        if (typeof option == 'object') {
            this._setOption(option);
            return;
        }
    },
    destroy: function () {
        for (property in this.ui) {
            this.ui[property].remove();
            delete this.ui[property];
        }
        this.element.removeData(this.name);
    }
}
$.wa.widget = function (name, prototype, base) {
    if (!base) {
        base = $.wa.base;
    }
    $.wa[name] = function (options, element) {
        if (arguments.length) {
            this._initial(options, element);
        }
    }
    $.wa[name].prototype = $.extend(true, {}, new base(), { name: name },prototype);
    $.wa.bridge(name, $.wa[name]);
}
$.wa.bridge = function (name, fn) {
    $.fn[name] = function (options) {
        var args = Array.prototype.slice.call(arguments, 1),
            returnValue = this,
            isMethodCall = typeof options === "string";
        if (isMethodCall) {
            this.each(function () {
                var instance = $.data(this, name),
                    methodValue = instance && $.isFunction(instance[options]) ?
                    instance[options].apply(instance, args) : instance;
                if (methodValue != instance &&typeof methodValue != 'undefined') {
                    returnValue = methodValue;
                    return false;
                }
            });
        } else {
            this.each(function () {
                $.data(this, name, new fn(options, this));
            });
        }
        return returnValue;
    }
}