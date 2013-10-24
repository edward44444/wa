/// <reference path="jquery.wa.core.js" />
/// <reference path="jquery.wa.widget.js" />

(function ($, undefined) {
    // for touch device mutil touch
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
            event.preventDefault();
            (this._mouseStarted && this._mouseUp(event));
            this._mouseDownEvent = event;
            var me = this, options = this.options, btnIsLeft = (event.which == 1);
            if (!btnIsLeft || !me._mouseCapture(event)) return;
            if (me._mouseDelayTimer) {
                clearTimeout(me._mouseDelayTimer);
                me._mouseDelayTimer = null;
            }
            me._mouseDelayMet = !options.delay;
            if (!me._mouseDelayMet) {
                me._mouseDelayTimer = setTimeout(function () {
                    me._mouseDelayMet = true;
                }, options.delay);
            }
            if (me._mouseDistanceMeet(event) && me._mouseDelayMeet(event)) {
                me._mouseStarted = (me._mouseStart(event) != false);
                if (!me._mouseStarted) {
                    return;
                }
            }
            $(document).bind('mousemove.' + me.name, function (event) { me._mouseMove(event); })
                    .bind('mouseup.' + me.name, function (event) { me._mouseUp(event); });
            mouseHandled = true;
        },
        _mouseDistanceMeet: function (event) {
            return (Math.max(Math.abs(this._mouseDownEvent.pageX - event.pageX), Math.abs(this._mouseDownEvent.pageY - event.pageY)) >= this.options.distance);
        },
        _mouseDelayMeet: function (event) {
            return this._mouseDelayMet;
        },
        _mouseMove: function (event) {
            event.preventDefault();
            if (this._mouseStarted) {
                this._mouseDrag(event);
                return;
            }
            if (this._mouseDistanceMeet(event) && this._mouseDelayMeet(event)) {
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