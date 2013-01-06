/// <reference path="jquery.wa.core.js" />
/// <reference path="jquery.wa.draggable.js" />
(function ($, undefined) {
    var scrollBezierArray = [], dragBezierArray = [], precisionNum = 100;
    //$.fx.interval = 2;
    $.easing = $.extend($.easing, {
        waScrollBezier: function (p) {
            if (!scrollBezierArray.length) {
                for (var i = 0; i <= precisionNum; i++) {
                    scrollBezierArray.push($.wa.cubicBezier({ x: 0, y: 0 }, { x: 0.15, y: 0.6 }, { x: 0.5, y: 0.95 }, { x: 1, y: 1 }, i / precisionNum));
                }
            }
            return $.wa.getBezierY(scrollBezierArray, p);
        },
        waDragBezier: function (p) {
            return p;
        },
        waLinear: function (p) {
            return p;
        }
    });
    var waSpeedFn = $.speed;
    $.speed = function (speed, easing, fn) {
        if (typeof fn == 'object') {
            var opt = waSpeedFn.apply(this, [speed, easing, fn.complete]);
            opt.old = fn.complete;
            delete fn.complete;
            opt = $.extend(opt, fn);
            opt.complete = function () {
                if ($.isFunction(opt.old)) {
                    opt.old.call(this);
                }
                if (opt.queue) {
                    $.dequeue(this, opt.queue);
                }
            }
            return opt;
        }
        return waSpeedFn.apply(this, [speed, easing, fn]);
    };
    //        jQuery.fx.step.waScrollTop = function (fx) {
    //            $(fx.elem).css('top', fx.now + 'px');
    //        };
    $.wa.widget('scrollable', {
        options: {
            tripThreshold: 1500,
            boundThreshold: 100,
            distanceThreshold: 200,
            durationThreshold: 3000,
            timeThreshold: 400
        },
        _create: function () {
            this.guid = $.wa.guid++;
            var me = this, options = this.options, dragStartTime,
            dragEndTime, offsetTopStart, offsetTopEnd, distance,
            scrollTime, scrollbarHeight, elementHeight, childHeight, scrollbarOffsetTop, bound,
            elementOffsetTop,
            child = me.element.find('>:first-child')
                .draggable({
                    axis: 'y',
                    dragstart: function () {
                        dragStartTime = $.now();
                        offsetTopStart = parseFloat(child.css('top')) || 0;
                        elementOffsetTop = me.element.offset().top;
                        me.elementHeight = elementHeight = me.element.height();
                        me.childHeight = childHeight = child.height();
                        me.scrollbarHeight = scrollbarHeight = Math.pow(elementHeight, 2) / childHeight;
                        scrollbar.css({
                            height: scrollbarHeight + 'px'
                        });
                        scrollbarOffsetTop = -1 * (parseFloat(child.css('top')) || 0) * elementHeight / childHeight;
                        me.setScrollBarPosition(scrollbarOffsetTop);
                        me.showScrollbar();
                    },
                    dragstop: function () {
                        dragEndTime = $.now();
                        offsetTopEnd = parseFloat(child.css('top')) || 0;
                        if (offsetTopEnd > 0 || offsetTopEnd < (elementHeight - childHeight)) {
                            return;
                        }
                        if (dragEndTime - dragStartTime <= options.timeThreshold) {
                            distance = (1 - (dragEndTime - dragStartTime) / options.timeThreshold) * options.tripThreshold;
                            distance = distance * Math.min(Math.abs(offsetTopEnd - offsetTopStart), options.distanceThreshold) / options.distanceThreshold;
                            scrollTime = (distance / options.tripThreshold) * options.durationThreshold;
                            //scrollTime = options.durationThreshold;
                            //distance = options.tripThreshold;
                            child.animate({
                                top: (offsetTopEnd < offsetTopStart ? '-' : '+') + '=' + distance + 'px'
                            },
                            scrollTime, 'waScrollBezier', {
                                complete: function () {
                                    me.hideScrollbar();
                                },
                                step: function (now, fx) {
                                    if (now > 0 || now < (elementHeight - childHeight)) {
                                        child.stop();
                                        bound = options.boundThreshold * Math.abs(fx.end - now) / options.tripThreshold;
                                        child.animate({
                                            top: (now > 0 ? bound : elementHeight - childHeight - bound) + 'px'
                                        }, 200, 'waScrollBezier', {
                                            step: function (now) {
                                                scrollbarOffsetTop = -1 * now * elementHeight / childHeight;
                                                me.setScrollBarPosition(scrollbarOffsetTop);
                                            }
                                        }).animate({
                                            top: (now > 0 ? 0 : elementHeight - childHeight) + 'px'
                                        }, 400, 'waScrollBezier', {
                                            complete: function () {
                                                me.hideScrollbar();
                                            },
                                            step: function (now) {
                                                scrollbarOffsetTop = -1 * now * elementHeight / childHeight;
                                                me.setScrollBarPosition(scrollbarOffsetTop);
                                            }
                                        });
                                    } else {
                                        scrollbarOffsetTop = -1 * now * elementHeight / childHeight;
                                        me.setScrollBarPosition(scrollbarOffsetTop);
                                    }
                                }
                            });
                        } else {
                            me.hideScrollbar();
                        }
                    },
                    drag: function (event, offset) {
                        scrollbarOffsetTop = -1 * (parseFloat(child.css('top')) || 0) * elementHeight / childHeight;
                        me.setScrollBarPosition(scrollbarOffsetTop);
                        if (offset.top - elementOffsetTop > 0) {
                            //console.log(2 * Math.atan(100) / Math.PI);
                            //offset.top = elementOffsetTop + 2 * Math.atan(offset.top - elementOffsetTop) * elementHeight / Math.PI;
                        }
                        return offset;
                    }
                }).bind('mousedown.' + me.name, function () {
                    child.stop();
                    me.hideScrollbar();
                }),
            scrollbar = $('<div class="wa-scrollable-scrollbar" style="display:none;"></div>').appendTo(me.element);
            $(document).bind('mouseup.' + me.name + me.guid, function () {
                if (child.is(':animated')) {
                    return;
                }
                offsetTopEnd = parseFloat(child.css('top')) || 0;
                if (offsetTopEnd > 0 || offsetTopEnd < (elementHeight - childHeight)) {
                    child.animate({
                        top: (offsetTopEnd > 0 ? 0 : elementHeight - childHeight) + 'px'
                    }, 800, 'waScrollBezier', {
                        complete: function () {
                            me.hideScrollbar();
                        },
                        step: function (now) {
                            scrollbarOffsetTop = -1 * now * elementHeight / childHeight;
                            me.setScrollBarPosition(scrollbarOffsetTop);
                        }
                    });
                }
            });
            me.child = child;
            if ($.wa.support.touch) {
                me.child.touchpunch();
            }
            this.ui = {};
            this.ui.scrollbar = scrollbar;
        },
        setScrollBarPosition: function (scrollbarOffsetTop) {
            if (scrollbarOffsetTop < 0) {
                scrollbarOffsetTop = scrollbarOffsetTop * this.childHeight / this.elementHeight;
                this.ui.scrollbar.css({
                    height: (this.scrollbarHeight + scrollbarOffsetTop) + 'px',
                    top: '0px'
                });
            } else if (scrollbarOffsetTop > this.elementHeight - this.scrollbarHeight) {
                scrollbarOffsetTop = (scrollbarOffsetTop - this.elementHeight + this.scrollbarHeight) * this.childHeight / this.elementHeight;
                this.ui.scrollbar.css({
                    height: (this.scrollbarHeight - scrollbarOffsetTop) + 'px',
                    top: this.elementHeight - this.scrollbarHeight + scrollbarOffsetTop + 'px'
                });
            } else {
                this.ui.scrollbar.css({
                    top: scrollbarOffsetTop + 'px',
                    height: this.scrollbarHeight + 'px'
                });
            }
        },
        hideScrollbar: function () {
            this.ui.scrollbar.hide();
        },
        showScrollbar: function () {
            if (this.ui.scrollbar.is(':hidden')) {
                this.ui.scrollbar.show();
            }
        },
        destroy: function () {
            if ($.wa.support.touch) {
                this.child.touchpunch('destroy');
            }
            this.element.find('>:first-child').unbind('.' + this.name).draggable('destroy');
            $(document).unbind('.' + this.name + this.guid);
            $.wa.base.prototype.destroy.call(this);
        }
    });
})(jQuery);