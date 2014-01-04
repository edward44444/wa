/// <reference path="jquery-1.7.1.js" />
/// <reference path="jquery.wa.core.js" />
/// <reference path="jquery.wa.widget.js" />
/// <reference path="jquery.wa.mouse.js" />

(function ($, undefined) {
    $.wa.widget('resizable', $.wa.mouse, {
        options: {
            helper: true,
            container: null,
            minWidth: 80,
            minHeight: 80,
            controlArea: 8,
            orient: ''
        },
        _create: function () {
            var me = this, options = this.options;
            me.element.addClass('wa-resize');
            if (options.container == 'parent') {
                me.container = me.element.parent();
            } else {
                me.container = options.container || $(document.body);
            }
            me._mouseInit();
            me.element.bind('mousemove.' + me.name, function (event) {
                if (!me._mouseCapture(event)) {
                    me.element.css('cursor', 'default');
                }
            });
        },
        _checkOrient: function (orient) {
            var orients = this.options.orient;
            if (!orients) {
                return true;
            }
            return orients.indexOf(orient) > -1;
        },
        _mouseCapture: function (event) {
            var offset = this.element.offset(), pageX = event.pageX, pageY = event.pageY, controlArea = this.options.controlArea,
                elementOuterWidth = this.element.outerWidth(), elementOuterHeight = this.element.outerHeight();
            if (this._checkOrient('n') && pageX >= offset.left + controlArea && pageX <= offset.left + elementOuterWidth - controlArea && pageY >= offset.top && pageY <= offset.top + controlArea) {
                this.orient = 'n';
                this.element.css('cursor', 'n-resize');
                return true;
            }
            if (this._checkOrient('s') && pageX >= offset.left + controlArea && pageX <= offset.left + elementOuterWidth - controlArea && pageY >= offset.top + elementOuterHeight - controlArea && pageY <= offset.top + elementOuterHeight) {
                this.orient = 's';
                this.element.css('cursor', 's-resize');
                return true;
            }
            if (this._checkOrient('w')&&pageX >= offset.left && pageX <= offset.left + controlArea && pageY >= offset.top + controlArea && pageY <= offset.top + elementOuterHeight - controlArea) {
                this.orient = 'w';
                this.element.css('cursor', 'w-resize');
                return true;
            }
            if (this._checkOrient('e') && pageX >= offset.left + elementOuterWidth - controlArea && pageX <= offset.left + elementOuterWidth && pageY >= offset.top + controlArea && pageY <= offset.top + elementOuterHeight - controlArea) {
                this.orient = 'e';
                this.element.css('cursor', 'e-resize');
                return true;
            }
            if (this._checkOrient('ne') && pageX > offset.left + elementOuterWidth - controlArea && pageX <= offset.left + elementOuterWidth && pageY >= offset.top && pageY < offset.top + controlArea) {
                this.orient = 'ne';
                this.element.css('cursor', 'ne-resize');
                return true;
            }
            if (this._checkOrient('nw') && pageX >= offset.left && pageX < offset.left + controlArea && pageY >= offset.top && pageY < offset.top + controlArea) {
                this.orient = 'nw';
                this.element.css('cursor', 'nw-resize');
                return true;
            }
            if (this._checkOrient('se') && pageX > offset.left + elementOuterWidth - controlArea && pageX <= offset.left + elementOuterWidth && pageY > offset.top + elementOuterHeight - controlArea && pageY <= offset.top + elementOuterHeight) {
                this.orient = 'se';
                this.element.css('cursor', 'se-resize');
                return true;
            }
            if (this._checkOrient('sw') && pageX >= offset.left && pageX < offset.left + controlArea && pageY > offset.top + elementOuterHeight - controlArea && pageY <= offset.top + elementOuterHeight) {
                this.orient = 'sw';
                this.element.css('cursor', 'sw-resize');
                return true;
            }
        },
        _mouseStart: function (event) {
            var me = this, options = this.options;
            me.containerWidth = me.container.width();
            me.containerHeight = me.container.height();
            me.containerOffset = me.container.offset();
            me.elementOffset = me.element.offset();
            me.elementWidth = me.element.width();
            me.elementHeight = me.element.height();
            me.borderLeftWidth = parseInt(me.element.css('border-left-width')) || 0;
            me.borderRightWidth = parseInt(me.element.css('border-right-width')) || 0;
            me.borderBottomWidth = parseInt(me.element.css('border-bottom-width')) || 0;
            me.borderTopWidth = parseInt(me.element.css('border-top-width')) || 0;
            me.paddingLeft = parseInt(me.element.css('padding-left')) || 0;
            me.paddingRight = parseInt(me.element.css('padding-right')) || 0;
            me.paddingBottom = parseInt(me.element.css('padding-bottom')) || 0;
            me.paddingTop = parseInt(me.element.css('padding-top')) || 0;
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
                'top': '0px'
            }).appendTo(document.body);
            if (options.helper) {
                me.helper = $("<div></div>").css({
                    "position": "absolute",
                    "zIndex": (1 + $.wa.overlayZindex),
                    "width": me.elementOuterWidth - me.helperBorderWidth * 2 + "px",
                    "height": me.elementOuterHeight - me.helperBorderWidth * 2 + "px",
                    "border": "1px dashed #000000"
                }).appendTo(document.body).offset({ left: me.elementOffset.left, top: me.elementOffset.top });
            } else {
                me.helper = me.element;
            }
        },
        _mouseDrag: function (event) {
            var me = this, options = this.options,
                left = event.pageX - me.mouseRelativeLeft,
                top = event.pageY - me.mouseRelativeTop;
            if (me.orient.indexOf('s') > -1) {
                top = Math.max(top, me.elementOffset.top - me.elementOuterHeight + options.minHeight);
                top = Math.min(top, me.containerOffset.top + me.containerHeight - me.elementOuterHeight);
                me.helper.height((me.helper == me.element ? me.elementHeight : me.elementOuterHeight - me.helperBorderWidth * 2) + top - me.elementOffset.top);
            }
            if (me.orient.indexOf('n') > -1) {
                top = Math.min(top, me.elementOffset.top + me.elementOuterHeight - options.minHeight);
                top = Math.max(top, me.containerOffset.top);
                me.helper.offset({ top: top });
                me.helper.height((me.helper == me.element ? me.elementHeight : me.elementOuterHeight - me.helperBorderWidth * 2) + me.elementOffset.top - top);
            }
            if (me.orient.indexOf('w') > -1) {
                left = Math.min(left, me.elementOffset.left + me.elementOuterWidth - options.minWidth);
                left = Math.max(left, me.containerOffset.left);
                me.helper.offset({ left: left });
                me.helper.width((me.helper == me.element ? me.elementWidth : me.elementOuterWidth - me.helperBorderWidth * 2) + me.elementOffset.left - left);
            }
            if (me.orient.indexOf('e') > -1) {
                left = Math.max(left, me.elementOffset.left - me.elementOuterWidth + options.minWidth);
                left = Math.min(left, me.containerOffset.left + me.containerWidth - me.elementOuterWidth);
                me.helper.width((me.helper == me.element ? me.elementWidth : me.elementOuterWidth - me.helperBorderWidth * 2) + left - me.elementOffset.left);
            }
            if (me.helper == me.element) {
                me.element.triggerHandler('resize');
            }
        },
        _mouseStop: function (event) {
            var me = this, options = this.options;
            if (options.helper) {
                var helperOffset = me.helper.offset();
                me.element.width(me.helper.width() - me.paddingLeft - me.paddingRight - me.borderLeftWidth - me.borderRightWidth + me.helperBorderWidth * 2);
                me.element.height(me.helper.height() - me.paddingTop - me.paddingBottom - me.borderTopWidth - me.borderBottomWidth + me.helperBorderWidth * 2);
                me.element.offset({ left: helperOffset.left, top: helperOffset.top });
                me.element.triggerHandler('resize');
            }
            me._clear();
        },
        _clear: function () {
            if (this.overlay) {
                this.overlay.remove();
                this.overlay = null;
            }
            if (this.helper && this.helper[0] != this.element[0]) {
                this.helper.remove();
                this.helper = null;
            }
        },
        destroy: function () {
            var me = this;
            me._mouseDestroy();
            me.element.unbind('mousemove.' + me.name).removeClass('wa-resize').css('cursor', 'default');
        }
    });
})(jQuery);