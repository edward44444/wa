/// <reference path="jquery.wa.core.js" />
/// <reference path="jquery.wa.overlay.js" />
(function ($, undefined) {
    $.wa.widget('draggable', {
        options: {
            container: null,
            helper: false,
            scope: 'default',
            handle: null,
            axis: null,
            revert: false,
            revertDuration: 500,
            dragstart: function (event, inst) {
            },
            drag: function (event, offset) {
                return offset;
            },
            dragstop: function (event, inst) {
            }
        },
        _create: function () {
            var me = this, options = this.options, handle, container;
            me.guid = $.wa.guid++;
            if (options.handle) {
                handle = $(options.handle, me.element);
            } else {
                handle = me.element;
            }
            me.handle = handle.disableSelection();
            if (options.container == 'parent') {
                container = me.element.parent();
            } else {
                container = options.container || $(document.body);
            }
            var containerWidth, containerHeight, containerOffset, elementOuterWidth, elementOuterHeight,
                elementPosition, elementOffset, helperOffset, helperBorderWidth = 1,
                mouseRelativeLeft, mouseRelativeTop, left, top, offset, dragged, dropped, amendment;
            handle.css({ 'cursor': 'move' }).bind('mousedown.' + me.name, function (e) {
                dragged = false;
                dropped = false;
                containerWidth = container.width();
                containerHeight = container.height();
                containerOffset = container.offset();
                elementOffset = me.element.offset();
                elementPosition = me.element.position();
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
                if (options.helper == 'clone') {
                    me.helper = me.element.clone().css({
                        "position": "absolute",
                        "zIndex": 10000
                    }).appendTo('body').offset({
                        left: elementOffset.left,
                        top: elementOffset.top
                    });
                } else if (options.helper) {
                    me.helper = $("<div></div>").css({
                        "position": "absolute",
                        "zIndex": 10000,
                        "width": elementOuterWidth + "px",
                        "height": elementOuterHeight + "px",
                        "border": "1px dashed #000000"
                    }).appendTo('body').offset({
                        left: elementOffset.left - helperBorderWidth,
                        top: elementOffset.top - helperBorderWidth
                    });
                } else {
                    me.helper = me.element;
                }
                $(document).bind('mousemove.' + me.name + me.guid, function (e) {
                    e.preventDefault();
                    if (!dragged) {
                        me._trigger('dragstart', e, me);
                        if ($.wa.ddmanager) {
                            $.wa.ddmanager.current = me;
                            $.wa.ddmanager.dragStart(me, e);
                        }
                        dragged = true;
                    }
                    left = e.pageX - mouseRelativeLeft;
                    top = e.pageY - mouseRelativeTop;
                    if (options.container) {
                        amendment = (options.helper == true ? helperBorderWidth * 2 : 0);
                        left = Math.max(left, containerOffset.left);
                        left = Math.min(left, containerOffset.left + containerWidth - elementOuterWidth - amendment);
                        top = Math.max(top, containerOffset.top);
                        top = Math.min(top, containerOffset.top + containerHeight - elementOuterHeight - amendment);
                    }
                    if (options.axis == 'y') {
                        left = elementOffset.left;
                    } else if (options.axis == 'x') {
                        top = elementOffset.top;
                    }
                    offset = {
                        left: left,
                        top: top
                    };
                    offset = me._trigger('drag', e, offset) || offset;
                    if ($.wa.ddmanager) $.wa.ddmanager.drag(me, e);
                    me.helper.offset(offset);
                }).bind('mouseup.' + me.name + me.guid, function (e) {
                    $(document).unbind('mousemove.' + me.name + me.guid).unbind('mouseup.' + me.name + me.guid);
                    if (!dragged) {
                        me._clear();
                        me._trigger('tap', e, me);
                        return;
                    }
                    if ($.wa.ddmanager) dropped = $.wa.ddmanager.drop(me, event);
                    if (options.revert == 'invalid' && !dropped || options.revert == 'valid' && dropped || options.revert == true) {
                        me.helper.animate({
                            left: elementPosition.left + 'px',
                            top: elementPosition.top + 'px'
                        }, options.revertDuration, function () {
                            me._trigger('dragstop', e, me);
                            if ($.wa.ddmanager) $.wa.ddmanager.dragStop(me, e);
                            me._clear();
                        });
                    } else {
                        if (options.helper) {
                            helperOffset = me.helper.offset();
                            amendment = (options.helper == 'clone' ? 0 : helperBorderWidth);
                            me.element.offset({ left: helperOffset.left + amendment, top: helperOffset.top + amendment });
                        }
                        me._trigger('dragstop', e, me);
                        if ($.wa.ddmanager) $.wa.ddmanager.dragStop(me, e);
                        me._clear();
                    }
                });
            });
        },
        _clear: function () {
            if (this.overlay) this.overlay.remove();
            if (this.helper && this.helper[0] != this.element[0]) this.helper.remove();
        },
        destroy: function () {
            this.element.unbind('.' + this.name);
            this.handle.css({ cursor: 'default' });
            this.handle.enableSelection();
        }
    });
})(jQuery);