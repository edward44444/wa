/// <reference path="jquery.wa.mouse.js" />
/// <reference path="jquery-1.7.1.js" />
/// <reference path="jquery.wa.core.js" />
(function ($, undefined) {
    $.wa.widget('resizable',$.wa.mouse, {
        options: {
            resizeN: '.wa-resize-top',
            resizeS: '.wa-resize-bottom',
            resizeW: '.wa-resize-left',
            resizeE: '.wa-resize-right',
            resizeNE: '.wa-resize-top-right',
            resizeNW: '.wa-resize-top-left',
            resizeSE: '.wa-resize-bottom-right',
            resizeSW: '.wa-resize-bottom-left',
            helper: true,
            container: null,
            minWidth: 80,
            minHeight: 80
        },
        _create: function () {
            this.guid = $.wa.guid++;
            this.control = {};
            var me = this, options = this.options,
                resizeN = $(options.resizeN, me.element),
                resizeS = $(options.resizeS, me.element),
                resizeW = $(options.resizeW, me.element),
                resizeE = $(options.resizeE, me.element),
                resizeNE = $(options.resizeNE, me.element),
                resizeNW = $(options.resizeNW, me.element),
                resizeSE = $(options.resizeSE, me.element),
                resizeSW = $(options.resizeSW, me.element);
            me.element.addClass('wa-resize').disableSelection();
            if (!resizeN.length) {
                resizeN = $('<div></div>').addClass(options.resizeN.replace(/\./, '')).appendTo(me.element);
                me.resizeNAdd = true;
            }
            if (!resizeS.length) {
                resizeS = $('<div></div>').addClass(options.resizeS.replace(/\./, '')).appendTo(me.element);
                me.resizeSAdd = true;
            }
            if (!resizeW.length) {
                resizeW = $('<div></div>').addClass(options.resizeW.replace(/\./, '')).appendTo(me.element);
                me.resizeWAdd = true;
            }
            if (!resizeE.length) {
                resizeE = $('<div></div>').addClass(options.resizeE.replace(/\./, '')).appendTo(me.element);
                me.resizeEAdd = true;
            }
            if (!resizeNE.length) {
                resizeNE = $('<div></div>').addClass(options.resizeNE.replace(/\./, '')).appendTo(me.element);
                me.resizeNEAdd = true;
            }
            if (!resizeNW.length) {
                resizeNW = $('<div></div>').addClass(options.resizeNW.replace(/\./, '')).appendTo(me.element);
                me.resizeNWAdd = true;
            }
            if (!resizeSE.length) {
                resizeSE = $('<div></div>').addClass(options.resizeSE.replace(/\./, '')).appendTo(me.element);
                me.resizeSEAdd = true;
            }
            if (!resizeSW.length) {
                resizeSW = $('<div></div>').addClass(options.resizeSW.replace(/\./, '')).appendTo(me.element);
                me.resizeSWAdd = true;
            }
            me.control.resizeN = resizeN.css('cursor', 'n-resize');
            me.control.resizeS = resizeS.css('cursor', 's-resize');
            me.control.resizeW = resizeW.css('cursor', 'w-resize');
            me.control.resizeE = resizeE.css('cursor', 'e-resize');
            me.control.resizeNE = resizeNE.css('cursor', 'ne-resize');
            me.control.resizeNW = resizeNW.css('cursor', 'nw-resize');
            me.control.resizeSE = resizeSE.css('cursor', 'se-resize');
            me.control.resizeSW = resizeSW.css('cursor', 'sw-resize');
            if (options.container == 'parent') {
                me.container = me.element.parent();
            } else {
                me.container = options.container || $(document.body);
            }
            me._mouseInit();
        },
        _mouseCapture: function (event) {
            if (jQuery.contains(this.control.resizeN[0], event.target) || event.target == this.control.resizeN[0]) {
                this.orient = 'n';
                return true;
            }
            if (jQuery.contains(this.control.resizeS[0], event.target) || event.target == this.control.resizeS[0]) {
                this.orient = 's';
                return true;
            }
            if (jQuery.contains(this.control.resizeW[0], event.target) || event.target == this.control.resizeW[0]) {
                this.orient = 'w';
                return true;
            }
            if (jQuery.contains(this.control.resizeE[0], event.target) || event.target == this.control.resizeE[0]) {
                this.orient = 'e';
                return true;
            }
            if (jQuery.contains(this.control.resizeNE[0], event.target) || event.target == this.control.resizeNE[0]) {
                this.orient = 'ne';
                return true;
            }
            if (jQuery.contains(this.control.resizeNW[0], event.target) || event.target == this.control.resizeNW[0]) {
                this.orient = 'nw';
                return true;
            }
            if (jQuery.contains(this.control.resizeSE[0], event.target) || event.target == this.control.resizeSE[0]) {
                this.orient = 'se';
                return true;
            }
            if (jQuery.contains(this.control.resizeSW[0], event.target) || event.target == this.control.resizeSW[0]) {
                this.orient = 'sw';
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
                "background-color": '#000000',
                "opacity": 0,
                'left': '0px',
                'top': '0px'
            }).appendTo(document.body);
            if (options.helper) {
                me.helper = $("<div></div>").css({
                    "position": "absolute",
                    "zIndex": 10000,
                    "width": me.elementOuterWidth + "px",
                    "height": me.elementOuterHeight + "px",
                    "border": "1px dashed #000000"
                }).appendTo(document.body).offset({ left: me.elementOffset.left - me.helperBorderWidth, top: me.elementOffset.top - me.helperBorderWidth });
            } else {
                me.helper = me.element;
            }
        },
        _mouseDrag: function (event) {
            var me = this, options = this.options, left, top;
            left = event.pageX - me.mouseRelativeLeft;
            top = event.pageY - me.mouseRelativeTop;
            if (me.orient.indexOf('s') > -1) {
                top = Math.max(top, me.elementOffset.top - me.elementOuterHeight + options.minHeight);
                top = Math.min(top, me.containerOffset.top + me.containerHeight - me.elementOuterHeight - me.helperBorderWidth);
                me.helper.height((me.helper == me.element ? me.elementHeight : me.elementOuterHeight) + top - me.elementOffset.top);
            }
            if (me.orient.indexOf('n') > -1) {
                top = Math.min(top, me.elementOffset.top + me.elementOuterHeight - options.minHeight);
                top = Math.max(top, me.containerOffset.top + me.helperBorderWidth);
                me.helper.offset({ top: top - (me.helper == me.element ? 0 : me.helperBorderWidth) });
                me.helper.height((me.helper == me.element ? me.elementHeight : me.elementOuterHeight) + me.elementOffset.top - top);
            }
            if (me.orient.indexOf('w') > -1) {
                left = Math.min(left, me.elementOffset.left + me.elementOuterWidth - options.minWidth);
                left = Math.max(left, me.containerOffset.left + me.helperBorderWidth);
                me.helper.offset({ left: left - (me.helper == me.element ? 0 : me.helperBorderWidth) });
                me.helper.width((me.helper == me.element ? me.elementWidth : me.elementOuterWidth) + me.elementOffset.left - left);
            }
            if (me.orient.indexOf('e') > -1) {
                left = Math.max(left, me.elementOffset.left - me.elementOuterWidth + options.minWidth);
                left = Math.min(left, me.containerOffset.left + me.containerWidth - me.elementOuterWidth - me.helperBorderWidth);
                me.helper.width((me.helper == me.element ? me.elementWidth : me.elementOuterWidth) + left - me.elementOffset.left);
            }
            if (me.helper == me.element) {
                me.element.triggerHandler('resize');
            }
        },
        _mouseStop: function (event) {
            var me = this, options = this.options;
            if (options.helper) {
                var helperOffset = me.helper.offset();
                me.element.width(me.helper.width() - me.borderLeftWidth - me.borderRightWidth);
                me.element.height(me.helper.height() - me.borderTopWidth - me.borderBottomWidth);
                me.element.offset({ left: helperOffset.left + me.helperBorderWidth, top: helperOffset.top + me.helperBorderWidth });
                me.element.triggerHandler('resize');
            }
            me._clear();
        },
        _clear: function () {
            if (this.overlay) this.overlay.remove();
            if (this.helper && this.helper[0] != this.element[0]) this.helper.remove();
        },
        destroy: function () {
            var me = this;
            me._mouseDestroy();
            me.element.removeClass('wa-resize').enableSelection();
            for (var pro in me.control) {
                if (me[pro + 'Add']) {
                    me.control[pro].remove();
                }
            }
        }
    });
})(jQuery);