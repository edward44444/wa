/// <reference path="jquery.wa.core.js" />
/// <reference path="jquery.wa.overlay.js" />
$.wa.widget('dragable', {
    options: {
        container: 'parent',
        showSimulate: false,
        handle: null,
        axis:null
    },
    _create: function () {
        var me = this,options=this.options,handle,container;
        if (options.handle) {
            handle = $(options.handle, me.element);
        } else {
            handle = me.element;
        }
        handle.disableSelection();
        if (options.container == 'parent') {
            container = me.element.parent();
        } else {
            container = $(document);
        }
        var containerWidth,
            containerHeight,
            containerOffset,
            elementWidth,
            elementHeight,
            borderLeftWidth = parseInt(me.element.css('border-left-width')),
            borderRightWidth = parseInt(me.element.css('border-right-width')),
            borderBottomWidth = parseInt(me.element.css('border-bottom-width')),
            borderTopWidth = parseInt(me.element.css('border-top-width')),
            elementOffset, simulateBorderWidth = 1,
            simulate,overlay,mouseRelativeLeft, mouseRelativeTop, left, top;
        handle.css({ 'cursor': 'move' }).bind('mouseover.' + me.name, function (e) {
            handle.unbind('mousedown.' + me.name).bind('mousedown.' + me.name, function (e) {
                containerWidth = container.width();
                containerHeight = container.height();
                containerOffset = container.offset();
                elementOffset = me.element.offset();
                elementWidth = me.element.width();
                elementHeight = me.element.height();
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
                //$(document.body).overlay({opacity:0.0});
                if (options.showSimulate == true) {
                    simulate = $("<div></div>").css({
                        "position": "absolute",
                        "zIndex": 10000,
                        "width": elementWidth + borderLeftWidth + borderRightWidth + "px",
                        "height": elementHeight + borderTopWidth + borderBottomWidth + "px",
                        "border": "1px dashed #000000"
                    }).appendTo('body').offset({
                        left: elementOffset.left - simulateBorderWidth,
                        top: elementOffset.top - simulateBorderWidth
                    });
                }
                mouseRelativeLeft = e.pageX - elementOffset.left;
                mouseRelativeTop = e.pageY - elementOffset.top;
                $(document).bind('mousemove.' + me.name, function (e) {
                    e.preventDefault();
                    left = e.pageX - mouseRelativeLeft;
                    top = e.pageY - mouseRelativeTop;
                    if (options.container) {
                        left = Math.max(left, containerOffset.left + (options.showSimulate ? simulateBorderWidth : simulateBorderWidth*2));
                        left = Math.min(left, containerOffset.left + containerWidth - elementWidth - (options.showSimulate ? simulateBorderWidth*3 : simulateBorderWidth * 2));
                        top = Math.max(top, containerOffset.top + (options.showSimulate ? simulateBorderWidth : simulateBorderWidth * 2));
                        top = Math.min(top, containerOffset.top + containerHeight - elementHeight - (options.showSimulate ? simulateBorderWidth * 3 : simulateBorderWidth * 2));
                    }
                    if (options.axis == 'y') {
                        left = elementOffset.left;
                    } else if (options.axis == 'x') {
                        top = elementOffset.top;
                    }
                    if (options.showSimulate == true) {
                        simulate.offset({ left: left, top: top });
                    } else {
                        me.element.offset({ left: left, top: top });
                    }
                }).bind('mouseup.' + me.name, function (e) {
                    overlay.remove();
                    $(document).unbind('mousemove.' + me.name).unbind('mouseup.' + me.name);
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