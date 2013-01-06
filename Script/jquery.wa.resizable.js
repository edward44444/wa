/// <reference path="jquery-1.7.1.js" />
/// <reference path="jquery.wa.draggable.js" />
/// <reference path="jquery.wa.core.js" />
(function ($, undefined) {
    $.wa.widget('resizable', {
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
            var me = this, options = this.options, container,
                resizeN = $(options.resizeN, me.element),
                resizeS = $(options.resizeS, me.element),
                resizeW = $(options.resizeW, me.element),
                resizeE = $(options.resizeE, me.element),
                resizeNE = $(options.resizeNE, me.element),
                resizeNW = $(options.resizeNW, me.element),
                resizeSE = $(options.resizeSE, me.element),
                resizeSW = $(options.resizeSW, me.element);
            me.element.addClass('wa-resize');
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
            me.control.resizeN = resizeN.disableSelection();
            me.control.resizeS = resizeS.disableSelection();
            me.control.resizeW = resizeW.disableSelection();
            me.control.resizeE = resizeE.disableSelection();
            me.control.resizeNE = resizeNE.disableSelection();
            me.control.resizeNW = resizeNW.disableSelection();
            me.control.resizeSE = resizeSE.disableSelection();
            me.control.resizeSW = resizeSW.disableSelection();
            if (options.container == 'parent') {
                container = me.element.parent();
            } else {
                container = options.container || $(document.body);
            }
            me.container = container;
            resizeN.css('cursor', 'n-resize');
            me._bindEvent(resizeN, 'n');
            resizeS.css('cursor', 's-resize');
            me._bindEvent(resizeS, 's');
            resizeW.css('cursor', 'w-resize');
            me._bindEvent(resizeW, 'w');
            resizeE.css('cursor', 'e-resize');
            me._bindEvent(resizeE, 'e');
            resizeNE.css('cursor', 'ne-resize');
            me._bindEvent(resizeNE, 'ne');
            resizeNW.css('cursor', 'nw-resize');
            me._bindEvent(resizeNW, 'nw');
            resizeSE.css('cursor', 'se-resize');
            me._bindEvent(resizeSE, 'se');
            resizeSW.css('cursor', 'sw-resize');
            me._bindEvent(resizeSW, 'sw');
        },
        _bindEvent: function (target, orient) {
            var me = this, options = this.options, elementOffset, elementWidth, elementOuterWidth, elementHeight,
                elementOuterHeight, helperOffset, helperBorderWidth = 1,
                mouseRelativeLeft, mouseRelativeTop, left, top, containerWidth,
                containerHeight, containerOffset, borderLeftWidth, borderRightWidth, borderBottomWidth, borderTopWidth;
            target.bind('mousedown.' + me.name, function (e) {
                containerWidth = me.container.width();
                containerHeight = me.container.height();
                containerOffset = me.container.offset();
                elementOffset = me.element.offset();
                elementWidth = me.element.width();
                elementHeight = me.element.height();
                borderLeftWidth = parseInt(me.element.css('border-left-width')) || 0;
                borderRightWidth = parseInt(me.element.css('border-right-width')) || 0;
                borderBottomWidth = parseInt(me.element.css('border-bottom-width')) || 0;
                borderTopWidth = parseInt(me.element.css('border-top-width')) || 0;
                elementOuterWidth = me.element.outerWidth();
                elementOuterHeight = me.element.outerHeight();
                mouseRelativeLeft = e.pageX - elementOffset.left;
                mouseRelativeTop = e.pageY - elementOffset.top;
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
                        "width": elementOuterWidth + "px",
                        "height": elementOuterHeight + "px",
                        "border": "1px dashed #000000"
                    }).appendTo('body').offset({ left: elementOffset.left - helperBorderWidth, top: elementOffset.top - helperBorderWidth });
                } else {
                    me.helper = me.element;
                }
                $(document).bind('mousemove.' + me.name + me.guid, function (e) {
                    e.preventDefault();
                    left = e.pageX - mouseRelativeLeft;
                    top = e.pageY - mouseRelativeTop;
                    if (orient.indexOf('s') > -1) {
                        top = Math.max(top, elementOffset.top - elementOuterHeight + options.minHeight);
                        top = Math.min(top, containerOffset.top + containerHeight - elementOuterHeight - helperBorderWidth);
                        me.helper.height((me.helper == me.element ? elementHeight : elementOuterHeight) + top - elementOffset.top);
                    }
                    if (orient.indexOf('n') > -1) {
                        top = Math.min(top, elementOffset.top + elementOuterHeight - options.minHeight);
                        top = Math.max(top, containerOffset.top + helperBorderWidth);
                        me.helper.offset({ top: top - (me.helper == me.element ? 0 : helperBorderWidth) });
                        me.helper.height((me.helper == me.element ? elementHeight : elementOuterHeight) + elementOffset.top - top);
                    }
                    if (orient.indexOf('w') > -1) {
                        left = Math.min(left, elementOffset.left + elementOuterWidth - options.minWidth);
                        left = Math.max(left, containerOffset.left + helperBorderWidth);
                        me.helper.offset({ left: left - (me.helper == me.element ? 0 : helperBorderWidth) });
                        me.helper.width((me.helper == me.element ? elementWidth : elementOuterWidth) + elementOffset.left - left);
                    }
                    if (orient.indexOf('e') > -1) {
                        left = Math.max(left, elementOffset.left - elementOuterWidth + options.minWidth);
                        left = Math.min(left, containerOffset.left + containerWidth - elementOuterWidth - helperBorderWidth);
                        me.helper.width((me.helper == me.element ? elementWidth : elementOuterWidth) + left - elementOffset.left);
                    }
                    if (me.helper == me.element) {
                        me.element.triggerHandler('resize');
                    }
                }).bind('mouseup.' + me.name + me.guid, function (e) {
                    $(document).unbind('mousemove.' + me.name + me.guid).unbind('mouseup.' + me.name + me.guid);
                    if (options.helper) {
                        helperOffset = me.helper.offset();
                        me.element.width(me.helper.width() - borderLeftWidth - borderRightWidth);
                        me.element.height(me.helper.height() - borderTopWidth - borderBottomWidth);
                        me.element.offset({ left: helperOffset.left + helperBorderWidth, top: helperOffset.top + helperBorderWidth });
                        me.element.triggerHandler('resize');
                    }
                    me._clear();
                });
            });
        },
        _clear: function () {
            if (this.overlay) this.overlay.remove();
            if (this.helper && this.helper[0] != this.element[0]) this.helper.remove();
        },
        destroy: function () {
            var me = this;
            me.element.removeClass('wa-resize');
            for (var pro in me.control) {
                me.control[pro].unbind('.' + me.name).enableSelection();
                if (me[pro + 'Add']) {
                    me.control[pro].remove();
                }
            }
        }
    });
})(jQuery);