/// <reference path="jquery.wa.core.js" />
/// <reference path="jquery.wa.overlay.js" />
$.wa.widget('dragable', {
    options: {
        container:null,
        showSimulate: false,
        handle: null,
        axis: null,
        onDragStart: function () {
        },
        onDrag: function (offset) {
            return offset;
        },
        onDragEnd: function () {
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
        handle.css({ 'cursor': 'move' }).bind('mouseover.' + me.name, function (e) {
            handle.unbind('mousedown.' + me.name).bind('mousedown.' + me.name, function (e) {
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
                if (options.showSimulate == true) {
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
                        if ($.isFunction(options.onDragStart)) {
                            options.onDragStart.call(me);
                        }
                        dragged = true;
                    }
                    e.preventDefault();
                    left = e.pageX - mouseRelativeLeft;
                    top = e.pageY - mouseRelativeTop;
                    if (options.container) {
                        left = Math.max(left, containerOffset.left + (options.showSimulate ? simulateBorderWidth : simulateBorderWidth*2));
                        left = Math.min(left, containerOffset.left + containerWidth - elementOuterWidth - (options.showSimulate ? simulateBorderWidth * 3 : simulateBorderWidth * 2));
                        top = Math.max(top, containerOffset.top + (options.showSimulate ? simulateBorderWidth : simulateBorderWidth * 2));
                        top = Math.min(top, containerOffset.top + containerHeight - elementOuterHeight - (options.showSimulate ? simulateBorderWidth * 3 : simulateBorderWidth * 2));
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
                    if ($.isFunction(options.onDrag)) {
                        offset = options.onDrag.call(me, offset);
                    }
                    if (options.showSimulate == true) {
                        simulate.offset(offset);
                    } else {
                        me.element.offset(offset);
                    }
                }).bind('mouseup.' + me.name + me.guid, function (e) {
                    if (dragged &&$.isFunction(options.onDragEnd)) {
                        options.onDragEnd.call(me);
                    }
                    overlay.remove();
                    $(document).unbind('mousemove.' + me.name + me.guid).unbind('mouseup.' + me.name + me.guid);
                    if (options.showSimulate == true) {
                        var simulateOffset = simulate.offset();
                        me.element.offset({ left: simulateOffset.left + simulateBorderWidth, top: simulateOffset.top + simulateBorderWidth });
                        simulate.remove();
                    }
                });
            }).bind('mouseout.' + me.name, function (e) {
                handle.unbind('mousedown.' + me.name);
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