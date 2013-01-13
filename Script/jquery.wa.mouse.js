/// <reference path="jquery-1.7.1.js" />
/// <reference path="jquery.wa.core.js" />
(function ($, undefined) {
    var mouseHandled = false;
    $.wa.widget('mouse', {
        options: {
            distance: 1,
            delay: 0
        },
        _mouseInit: function () {
            var me = this;
            me.element.bind('mousedown.' + me.name, function (event) {
                me._mouseDown(event);
            });
        },
        _mouseDown: function (event) {
            if (mouseHandled) return;
            (this._mouseStarted && this._mouseUp(event));
            this._mouseDownEvent = event;
            var me = this, options = this.options, btnIsLeft = (event.which == 1);
            if (!btnIsLeft || !me._mouseCapture(event)) return;
            if (me.mouseDelayTimer) {
                clearInterval(me.mouseDelayTimer);
                me.mouseDelayTimer = null;
            }
            me.mouseDelayMet = !options.delay;
            if (!me.mouseDelayMet) {
                me.mouseDelayTimer = setTimeout(function () {
                    me.mouseDelayMet = true;
                }, options.delay);
            }
            if (me._mouseDistanceMet(event) && me._mouseDelayMet(event)) {
                me._mouseStarted = (me._mouseStart(event) != false);
                if (!me._mouseStarted) {
                    event.preventDefault();
                    return true;
                }
            }
            $(document).bind('mousemove.' + me.name, function (event) { me._mouseMove(event); })
                .bind('mouseup.' + me.name, function (event) { me._mouseUp(event); });
            event.preventDefault();
            mouseHandled = true;
        },
        _mouseDistanceMet: function (event) {
            return (Math.max(Math.abs(this._mouseDownEvent.pageX - event.pageX), Math.abs(this._mouseDownEvent.pageY - event.pageY)) >= this.options.distance);
        },
        _mouseDelayMet: function (event) {
            return this.mouseDelayMet;
        },
        _mouseMove: function (event) {
            event.preventDefault();
            if (this._mouseStarted) {
                this._mouseDrag(event);
                return;
            }
            if (this._mouseDistanceMet(event) && this._mouseDelayMet(event)) {
                this._mouseStarted = (this._mouseStart(this._mouseDownEvent) != false);
                (this._mouseStarted ? this._mouseDrag(event) : this._mouseUp(event));
            }
        },
        _mouseUp: function (event) {
            $(document).unbind('mousemove.' + this.name).unbind('mouseup.' + this.name);
            if (this._mouseStarted) {
                this._mouseStarted = false;
                this._mouseStop(event);
            } else {
                this._mouseDownEvent.type = 'tap';
                $(this._mouseDownEvent.target).trigger(this._mouseDownEvent);
            }
            mouseHandled = false;
        },
        _mouseStart: function (event) {
            console.log('_mouseStart');
        },
        _mouseDrag: function (event) {
            console.log('_mouseDrag');
        },
        _mouseStop: function (event) {
            console.log('_mouseStop');
        },
        _mouseCapture: function (event) {
            return true;
        },
        _mouseDestroy: function () {
            this.element.unbind('.' + this.name);
            if (this._mouseStarted) {
                $(document).unbind('mousemove.' + this.name).unbind('mouseup.' + this.name);
            }
        }
    });
})(jQuery);