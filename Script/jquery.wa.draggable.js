/// <reference path="jquery.wa.core.js" />
/// <reference path="jquery.wa.widget.js" />
/// <reference path="jquery.wa.mouse.js" />

(function ($, undefined) {
    $.wa.widget('draggable',$.wa.mouse, {
        options: {
            container: null,
            // for droppable
            scope: 'default',
            helper: false,
            handle: null,
            axis: null,
            revert: false,
            revertDuration: 500,
            dragstart: function (event, inst) {
            },
            drag: function (event, offset, inst) {
                return offset;
            },
            dragstop: function (event, inst) {
            }
        },
        _create: function () {
            var me = this, options = this.options;
            me.guid = $.wa.guid++;
            if (options.handle) {
                me.handle = $(options.handle, me.element);
            } else {
                me.handle = me.element;
            }
            me.handle.disableSelection().css({ 'cursor': 'move' });
            if (options.container == 'parent') {
                me.container = me.element.parent();
            } else {
                me.container = options.container || $(document.body);
            }
            me._mouseInit();
        },
        _mouseCapture: function (event) {
            return (jQuery.contains(this.handle[0], event.target) || event.target == this.handle[0]);
        },
        _mouseStart: function (event) {
            var me = this, options = this.options;
            me.containerWidth = me.container.width();
            me.containerHeight = me.container.height();
            me.containerOffset = me.container.offset();
            me.elementOffset = me.element.offset();
            me.elementPosition = { left: parseFloat(me.element.css('left')) || 0, top: parseFloat(me.element.css('top')) || 0 };
            me.elementOuterWidth = me.element.outerWidth();
            me.elementOuterHeight = me.element.outerHeight();
            me.mouseRelativeLeft = event.pageX - me.elementOffset.left;
            me.mouseRelativeTop = event.pageY - me.elementOffset.top;
            me.helperBorderWidth = 1;
            me.overlay = $('<div></div>').css({
                "position": "absolute",
                "zIndex": (4 + $.wa.overlayZindex),
                "width": $(document.body).width() + "px",
                "height": $(document.body).height() + "px",
                "opacity": 0,
                'left': '0px',
                'top': '0px',
                'margin': '0px'
            }).appendTo(document.body);
            if (options.helper == 'clone') {
                me.helper = me.element.clone().css({
                    "position": "absolute",
                    "zIndex": (1 + $.wa.overlayZindex)
                }).appendTo(document.body).offset({
                    left: me.elementOffset.left,
                    top: me.elementOffset.top
                });
            } else if (options.helper) {
                me.helper = $("<div></div>").css({
                    "position": "absolute",
                    "zIndex": (1 + $.wa.overlayZindex),
                    "width": me.elementOuterWidth - me.helperBorderWidth * 2 + "px",
                    "height": me.elementOuterHeight - me.helperBorderWidth * 2 + "px",
                    "border": "1px dashed #000000"
                }).appendTo(document.body).offset({
                    left: me.elementOffset.left - me.helperBorderWidth,
                    top: me.elementOffset.top - me.helperBorderWidth
                });
            } else {
                me.helper = me.element;
            }
            me._trigger('dragstart', event, me);
            if ($.wa.ddmanager) {
                $.wa.ddmanager.current = me;
                $.wa.ddmanager.dragStart(me, event);
            }
        },
        _mouseDrag: function (event) {
            var me = this, options = this.options,
            left = event.pageX - me.mouseRelativeLeft,
            top = event.pageY - me.mouseRelativeTop;
            if (options.container) {
                left = Math.max(left, me.containerOffset.left);
                left = Math.min(left, me.containerOffset.left + me.containerWidth - me.elementOuterWidth);
                top = Math.max(top, me.containerOffset.top);
                top = Math.min(top, me.containerOffset.top + me.containerHeight - me.elementOuterHeight);
            }
            if (options.axis == 'y') {
                left = me.elementOffset.left;
            } else if (options.axis == 'x') {
                top = me.elementOffset.top;
            }
            var offset = {
                left: left,
                top: top
            };
            offset = me._trigger('drag', event, offset, me) || offset;
            if ($.wa.ddmanager) $.wa.ddmanager.drag(me, event);
            me.helper.offset(offset);
        },
        _mouseStop: function (event) {
            var me = this, options = this.options, dropped=false;
            if ($.wa.ddmanager) dropped = $.wa.ddmanager.drop(me, event);
            if (options.revert == 'invalid' && !dropped || options.revert == 'valid' && dropped || options.revert == true) {
                me.helper.animate({
                    left: me.elementPosition.left + 'px',
                    top: me.elementPosition.top + 'px'
                }, options.revertDuration, function () {
                    me._dragstop(event);
                });
            } else {
                if (options.helper) {
                   var helperOffset = me.helper.offset();
                   me.element.offset({ left: helperOffset.left, top: helperOffset.top });
                }
                me._dragstop(event);
            }
        },
        _dragstop: function (event) {
            this._trigger('dragstop', event, this);
            if ($.wa.ddmanager) $.wa.ddmanager.dragStop(this, event);
            this._clear();
        },
        _clear: function () {
            if (this.overlay) {
                this.overlay.remove();
                this.overlay = null;
            }
            if (this.helper) {
                if (this.helper[0] != this.element[0]) this.helper.remove();
                this.helper = null;
            }
        },
        destroy: function () {
            this._clear();
            this._mouseDestroy();
            this.handle.css({ cursor: 'default' });
            this.handle.enableSelection();
        }
    });
})(jQuery);