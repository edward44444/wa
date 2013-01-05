/// <reference path="jquery.wa.core.js" />
/// <reference path="jquery.wa.overlay.js" />
$.wa.widget('draggable', {
    options: {
        container:null,
        simulate: false,
        scope: 'default',
        handle: null,
        axis: null,
        dragstart: function (event,inst) {
        },
        drag: function (event,offset) {
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
        handle.disableSelection();
        if (options.container == 'parent') {
            container = me.element.parent();
        } else {
            container = options.container || $(document.body);
        }
        var containerWidth, containerHeight, containerOffset, elementOuterWidth, elementOuterHeight,
            elementOffset, simulateBorderWidth = 1,
            simulate, overlay, mouseRelativeLeft, mouseRelativeTop, left, top, offset, dragged;
        handle.css({ 'cursor': 'move' }).bind('mousedown.' + me.name, function (e) {
            dragged = false;
            containerWidth = container.width();
            containerHeight = container.height();
            containerOffset = container.offset();
            elementOffset = me.element.offset();
            elementOuterWidth = me.element.outerWidth();
            elementOuterHeight = me.element.outerHeight();
            overlay = $('<div></div>').css({
                "position": "absolute",
                "zIndex": (4 + $.wa.overlayZindex),
                "width": $(document.body).width() + "px",
                "height": $(document.body).height() + "px",
                "background-color": '#000000',
                "opacity": 0,
                'left': '0px',
                'top': '0px'
            }).appendTo(document.body);
            if (options.simulate == 'clone') {
                simulate = me.element.clone().css({
                    "position": "absolute",
                    "zIndex": 10000
                }).appendTo('body').offset({
                    left: elementOffset.left,
                    top: elementOffset.top
                });
            } else if (options.simulate) {
                simulate = $("<div></div>").css({
                    "position": "absolute",
                    "zIndex": 10000,
                    "width": elementOuterWidth + "px",
                    "height": elementOuterHeight + "px",
                    "border": "1px dashed #000000"
                }).appendTo('body').offset({
                    left: elementOffset.left - simulateBorderWidth,
                    top: elementOffset.top - simulateBorderWidth
                });
            }
            mouseRelativeLeft = e.pageX - elementOffset.left;
            mouseRelativeTop = e.pageY - elementOffset.top;
            $(document).bind('mousemove.' + me.name + me.guid, function (e) {
                if (!dragged) {
                    me._trigger('dragstart', e, me);
                    if ($.wa.ddmanager) {
                        $.wa.ddmanager.current = me;
                        $.wa.ddmanager.dragStart(me, e);
                    }
                    dragged = true;
                }
                e.preventDefault();
                left = e.pageX - mouseRelativeLeft;
                top = e.pageY - mouseRelativeTop;
                if (options.container) {
                    left = Math.max(left, containerOffset.left);
                    left = Math.min(left, containerOffset.left + containerWidth - elementOuterWidth - (options.simulate==true ? simulateBorderWidth * 2 : 0));
                    top = Math.max(top, containerOffset.top);
                    top = Math.min(top, containerOffset.top + containerHeight - elementOuterHeight - (options.simulate==true ? simulateBorderWidth * 2 : 0));
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
                if ($.wa.ddmanager) {
                    $.wa.ddmanager.drag(me, e);
                }
                if (options.simulate) {
                    simulate.offset(offset);
                } else {
                    me.element.offset(offset);
                }
            }).bind('mouseup.' + me.name + me.guid, function (e) {
                if (dragged) {
                    me._trigger('dragstop', e, me);
                }
                if ($.wa.ddmanager) {
                    $.wa.ddmanager.dragStop(me, e);
                }
                overlay.remove();
                $(document).unbind('mousemove.' + me.name + me.guid).unbind('mouseup.' + me.name + me.guid);
                if (options.simulate) {
                    var simulateOffset = simulate.offset();
                    if (options.simulate == 'clone') {
                        me.element.offset({ left: simulateOffset.left, top: simulateOffset.top });
                    } else {
                        me.element.offset({ left: simulateOffset.left + simulateBorderWidth, top: simulateOffset.top + simulateBorderWidth });
                    }
                    simulate.remove();
                }
            });
        });
        this.handle = handle;
    },
    destroy: function () {
        this.element.unbind('.' + this.name);
        this.handle.css({cursor:'default'});
        this.handle.enableSelection();
    }
});