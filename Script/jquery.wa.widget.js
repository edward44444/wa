/// <reference path="jquery.wa.core.js" />

(function ($, undefined) {
    $.wa.base = function (options, element) {
        if (arguments.length) {
            this._initial(options, element);
        }
    }
    $.wa.base.prototype = {
        options: {},
        element: null,
        name: 'base',
        ui: {},
        _initial: function (options, element) {
            this.options = $.extend({}, this.options, options);
            this.element = $(element);
            this._create();
        },
        _create: function () {
        },
        _reset: function () {
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
            for (prop in this.ui) {
                this.ui[prop].remove();
                delete this.ui[prop];
            }
            this.element.unbind('.' + this.name);
            this.element.removeData(this.name);
        },
        _trigger: function (type, event, data) {
            var callback = this.options[type];
            var args = Array.prototype.slice.call(arguments, 1)
            event.type = this.name + type;
            event.target = this.element[0];
            this.element.trigger(event);
            if ($.isFunction(callback)) {
                return callback.apply(this.element[0], args);
            }
        }
    };
    $.wa.widget = function (name, base, prototype) {
        if (!prototype) {
            prototype = base;
            base = $.wa.base;
        }
        $.wa[name] = function (options, element) {
            if (arguments.length) {
                this._initial(options, element);
            }
        }
        $.wa[name].prototype = $.extend(true, {}, new base(), prototype);
        $.wa[name].prototype.name = name;
        $.wa[name].prototype.base = new base();
        $.wa.bridge(name, $.wa[name]);
    };
    $.wa.bridge = function (name, fn) {
        $.fn[name] = function (options) {
            var args = Array.prototype.slice.call(arguments, 1), returnValue = this, isMethodCall = typeof options === "string";
            if (isMethodCall) {
                this.each(function () {
                    var instance = $.data(this, name), methodValue = instance && $.isFunction(instance[options]) ? instance[options].apply(instance, args) : instance;
                    if (methodValue != instance && typeof methodValue != 'undefined') {
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
})(jQuery);