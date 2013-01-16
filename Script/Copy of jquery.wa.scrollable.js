/// <reference path="jquery.wa.core.js" />
/// <reference path="jquery.wa.mouse.js" />
/// <reference path="jquery.wa.draggable.js" />
(function ($, undefined) {
    var scrollBezierArray = [], dragBezierArray = [], precisionNum = 100;
    //$.fx.interval = 10;
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
    $.fx.step['scrollOffsetTop'] = function (fx) {
        fx.elem['scrollOffsetTop'] = fx.now;
        $(fx.elem).css({
            top: fx.now + 'px'
        });
    }
    //var waSpeedFn = $.speed;
    //$.speed = function (speed, easing, fn) {
    //    if (typeof fn == 'object') {
    //        var opt = waSpeedFn.apply(this, [speed, easing, fn.complete]);
    //        opt.old = fn.complete;
    //        delete fn.complete;
    //        opt = $.extend(opt, fn);
    //        opt.complete = function () {
    //            if ($.isFunction(opt.old)) {
    //                opt.old.call(this);
    //            }
    //            if (opt.queue) {
    //                $.dequeue(this, opt.queue);
    //            }
    //        }
    //        return opt;
    //    }
    //    return waSpeedFn.apply(this, [speed, easing, fn]);
    //};
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
            child = me.element.wrapInner('<div></div>').find('>:first-child').css({ position: 'relative' })
                .draggable({
                    axis: 'y',
                    dragstart: function () {
                        dragStartTime = $.now();
                        offsetTopStart = parseFloat(child.css('top')) || 0;
                        elementOffsetTop = me.element.offset().top;
                        me.elementHeight = elementHeight = me.element.outerHeight();
                        me.childHeight = childHeight = child.outerHeight();
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
                            scrollTime =Math.max((distance / options.tripThreshold) * options.durationThreshold,1000);
                            child.animate({
                                scrollOffsetTop: (offsetTopEnd < offsetTopStart ? '-' : '+') + '=' + distance + 'px'
                            }, {
                                duration: scrollTime,
                                easing: 'waScrollBezier',
                                complete: function () {
                                    me.hideScrollbar();
                                },
                                step: function (now, fx) {
                                    if (now > 0 || now < (elementHeight - childHeight)) {
                                        child.stop();
                                        bound = options.boundThreshold * Math.abs(fx.end - now) / options.tripThreshold;
                                        child.animate({
                                            scrollOffsetTop: (now > 0 ? bound : elementHeight - childHeight - bound) + 'px'
                                        }, {
                                            duration: 200,
                                            easing: 'waScrollBezier',
                                            step: function (now) {
                                                scrollbarOffsetTop = -1 * now * elementHeight / childHeight;
                                                me.setScrollBarPosition(scrollbarOffsetTop);
                                            }
                                        }).animate({
                                            scrollOffsetTop: (now > 0 ? 0 : elementHeight - childHeight) + 'px'
                                        }, {
                                            duration: 400,
                                            easing: 'waScrollBezier',
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
                            offset.top = elementOffsetTop + (offset.top - elementOffsetTop) * 0.5;
                            //console.log(2 * Math.atan(100) / Math.PI);
                            //offset.top = elementOffsetTop + 2 * Math.atan(offset.top - elementOffsetTop) * elementHeight / Math.PI;
                        }
                        if (offset.top <elementOffsetTop+elementHeight-childHeight) {
                            //offset.top = elementOffsetTop + elementHeight - childHeight - (elementOffsetTop + elementHeight - childHeight - offset.top) * 0.5;
                            offset.top = (elementOffsetTop + elementHeight - childHeight + offset.top) * 0.5;
                        }
                        return offset;
                    }
                }).bind('mousedown.' + me.name, function () {
                    child.stop();
                    me.hideScrollbar();
                }),
            scrollbar = $('<div class="wa-scrollable-scrollbar-vertical" style="display:none;"></div>').appendTo(me.element);
            $(document).bind('mouseup.' + me.name + me.guid, function () {
                if (child.is(':animated')) {
                    return;
                }
                offsetTopEnd = parseFloat(child.css('top')) || 0;
                if (offsetTopEnd > 0 || offsetTopEnd < (elementHeight - childHeight)) {
                    child.animate({
                        scrollOffsetTop: (offsetTopEnd > 0 ? 0 : elementHeight - childHeight) + 'px'
                    }, {
                        duration: 500,
                        easing: 'waScrollBezier',
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
            this.ui = {};
            this.ui.scrollbar = scrollbar;
        },
        setScrollBarPosition: function (scrollbarOffsetTop) {
            if (scrollbarOffsetTop < 0) {
                scrollbarOffsetTop = scrollbarOffsetTop * this.childHeight / this.elementHeight;
                this.ui.scrollbar.css({
                    height: Math.max((this.scrollbarHeight + scrollbarOffsetTop),0) + 'px',
                    top: '0px'
                });
            } else if (scrollbarOffsetTop > this.elementHeight - this.scrollbarHeight) {
                scrollbarOffsetTop = (scrollbarOffsetTop - this.elementHeight + this.scrollbarHeight) * this.childHeight / this.elementHeight;
                this.ui.scrollbar.css({
                    height: Math.max((this.scrollbarHeight - scrollbarOffsetTop),0) + 'px',
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
            var me = this;
            if (!me.scrollbarTimer) {
                me.scrollbarTimer = setTimeout(function () {
                    me.ui.scrollbar.hide();
                    clearTimeout(me.scrollbarTimer);
                    me.scrollbarTimer = null;
                }, 100);
            }
        },
        showScrollbar: function () {
            if (this.scrollbarTimer) {
                clearTimeout(this.scrollbarTimer);
                this.scrollbarTimer = null;
            }
            if (this.ui.scrollbar.is(':hidden')) {
                this.ui.scrollbar.show();
            }
        },
        destroy: function () {
            this.child.unbind('.' + this.name).draggable('destroy');
            $(document).unbind('.' + this.name + this.guid);
            $.wa.base.prototype.destroy.call(this);
        }
    });
})(jQuery);