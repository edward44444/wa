(function ($) {
    $.wa = {};
    var div = document.createElement("div");
    $.wa.support = {};
    $.wa.support.selectstart = "onselectstart" in div;
    $.wa.support.touch = 'ontouchend' in document;
    $.fn.disableSelection = function () {
        return this.bind(($.wa.support.selectstart ? "selectstart" : "mousedown") +
            ".wa-disableSelection", function (event) {
                event.preventDefault();
            });
    };
    $.fn.enableSelection = function () {
        return this.unbind(".wa-disableSelection");
    }
    $.wa.cubicBezier = function (p0, p1, p2, p3, t) {
        return {
            x: p0.x * Math.pow((1 - t), 3) + p1.x * 3 * t * Math.pow((1 - t), 2) + p2.x * 3 * (1 - t) * Math.pow(t, 2) + p3.x * Math.pow(t, 3),
            y: p0.y * Math.pow((1 - t), 3) + p1.y * 3 * t * Math.pow((1 - t), 2) + p2.y * 3 * (1 - t) * Math.pow(t, 2) + p3.y * Math.pow(t, 3)
        };
    }
    function GetBezierY(array, start, end, x) {
        var index = Math.floor((start + end) / 2), x1, x2, y1, y2;
        if (array[index].x >= x) {
            if (array[index - 1].x <= x) {
                x1 = array[index - 1].x;
                y1 = array[index - 1].y;
                x2 = array[index].x;
                y2 = array[index].y;
                return x * (y2 - y1) / (x2 - x1) + (x1 * y2 - x2 * y1) / (x1 - x2);
            } else {
                return GetBezierY(array, start, index, x);
            }
        } else {
            if (array[index + 1].x >= x) {
                //return array[index].x + '-' + array[index + 1].x;
                x1 = array[index].x;
                y1 = array[index].y;
                x2 = array[index + 1].x;
                y2 = array[index + 1].y;
                return x * (y2 - y1) / (x2 - x1) + (x1 * y2 - x2 * y1) / (x1 - x2);
            } else {
                return GetBezierY(array, index, end, x);
            }
        }
    }
    $.wa.getBezierY = function (array, x) {
        return GetBezierY(array, 0, array.length-1, x);
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
            for (property in this.ui) {
                this.ui[property].remove();
                delete this.ui[property];
            }
            this.element.removeData(this.name);
        },
        _trigger: function (type, event, data) {
            var callback = this.options[type];
            data = data || {};
            event.type = this.name + type;
            event.target = this.element[0];
            this.element.trigger(event, data);
            if ($.isFunction(callback)) {
                return callback.call(this.element[0], event, data);
            }
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
        $.wa[name].prototype = $.extend(true, {}, new base(), { name: name }, prototype);
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