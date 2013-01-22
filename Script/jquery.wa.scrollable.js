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
    //$.fx.step['scrollOffsetTop'] = function (fx) {
    //    fx.elem['scrollOffsetTop'] = fx.now;
    //    $(fx.elem).css({
    //        top: fx.now + 'px'
    //    });
    //}
    //$.fx.step['scrollOffsetLeft'] = function (fx) {
    //    fx.elem['scrollOffsetLeft'] = fx.now;
    //    $(fx.elem).css({
    //        left: fx.now + 'px'
    //    });
    //}
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
            tripThreshold: 500,
            boundThreshold: 100,
            distanceThreshold: 200,
            durationThreshold: 3000,
            timeThreshold: 400,
            direction: ''// vertical,horizontal
        },
        _create: function () {
            this.guid = $.wa.guid++;
            var me = this, options = this.options, dragStartTime,
            dragEndTime, offsetStart, offsetEnd, distance,
            scrollTime, scrollbarHeight,scrollbarWidth, elementHeight, elementWidth, childHeight, childWidth,
            scrollbarOffsetTop, scrollbarOffsetLeft, bound, elementOffset,animation,
            oriChild = me.element.find('>:first-child'),
            isVertical = (!this.options.direction || this.options.direction == 'vertical'),
            isHorizontal = (!this.options.direction || this.options.direction == 'horizontal'),
            child = me.element.wrapInner('<div></div>').find('>:first-child').css({
                position: 'relative',
                width: oriChild.outerWidth()+'px',
                height:oriChild.outerHeight()+'px'
            }).draggable({
                axis: options.direction ? (options.direction == 'vertical' ? 'y' : 'x') : '',
                dragstart: function () {
                    dragStartTime = $.now();
                    offsetStart = { top: parseFloat(child.css('top')) || 0, left: parseFloat(child.css('left')) || 0 };
                    elementOffset = me.element.offset();
                    me.elementHeight = elementHeight = me.element.outerHeight();
                    me.elementWidth = elementWidth = me.element.outerWidth();
                    me.childHeight = childHeight = child.outerHeight();
                    me.childWidth = childWidth = child.outerWidth();
                    me.scrollbarHeight = scrollbarHeight = Math.pow(elementHeight, 2) / childHeight;
                    me.scrollbarWidth = scrollbarWidth = Math.pow(elementWidth, 2) / childWidth;
                    scrollbarVertical.css({
                        height: scrollbarHeight + 'px'
                    });
                    scrollbarHorizontal.css({
                        width: scrollbarWidth + 'px'
                    });
                    me.setScrollBarVerticalPosition(-1 * (parseFloat(child.css('top')) || 0) * elementHeight / childHeight);
                    me.setScrollBarHorizontalPosition(-1 * (parseFloat(child.css('left')) || 0) * elementWidth / childWidth);
                    me.showScrollbar();
                },
                dragstop: function () {
                    dragEndTime = $.now();
                    offsetEnd = { top: parseFloat(child.css('top')) || 0, left: parseFloat(child.css('left')) || 0 };
                    if (dragEndTime - dragStartTime <= options.timeThreshold) {
                        distance = {};
                        distance.top = distance.left = (1 - (dragEndTime - dragStartTime) / options.timeThreshold) * options.tripThreshold;
                        distance.top = distance.top * Math.min(Math.abs(offsetEnd.top - offsetStart.top), options.distanceThreshold) / options.distanceThreshold;
                        distance.left = distance.left * Math.min(Math.abs(offsetEnd.left - offsetStart.left), options.distanceThreshold) / options.distanceThreshold;
                        scrollTime = Math.max((Math.max(distance.top, distance.left) / options.tripThreshold) * options.durationThreshold, 1000);
                        if (isVertical&&!(offsetEnd.top > 0 || offsetEnd.top < (elementHeight - childHeight))) {
                            child.animate({
                                top: (offsetEnd.top < offsetStart.top ? '-' : '+') + '=' + distance.top + 'px'
                            }, {
                                queue: false,
                                duration: scrollTime,
                                easing: 'waScrollBezier',
                                complete: function () {
                                    me.hideScrollbar();
                                },
                                step: function (now, fx) {
                                    me.stepVertical(now, fx);
                                }
                            });
                        }
                        if (isHorizontal&&!(offsetEnd.left > 0 || offsetEnd.left < (elementWidth - childWidth))) {
                            child.animate({
                                left: (offsetEnd.left < offsetStart.left ? '-' : '+') + '=' + distance.left + 'px'
                            }, {
                                queue: false,
                                duration: scrollTime,
                                easing: 'waScrollBezier',
                                complete: function () {
                                    me.hideScrollbar();
                                },
                                step: function (now, fx) {
                                    me.stepHorizontal(now, fx);
                                }
                            });
                        }
                    } else {
                        me.hideScrollbar();
                    }
                },
                drag: function (event, offset) {
                    if (isVertical) {
                        me.setScrollBarVerticalPosition(-1 * (parseFloat(child.css('top')) || 0) * elementHeight / childHeight);
                        if (offset.top - elementOffset.top > 0) {
                            offset.top = elementOffset.top + (offset.top - elementOffset.top) * 0.5;
                        }
                        if (offset.top < elementOffset.top + elementHeight - childHeight) {
                            offset.top = (elementOffset.top + elementHeight - childHeight + offset.top) * 0.5;
                        }
                    }
                    if (isHorizontal) {
                        me.setScrollBarHorizontalPosition(-1 * (parseFloat(child.css('left')) || 0) * elementWidth / childWidth);
                        if (offset.left - elementOffset.left > 0) {
                            offset.left = elementOffset.left + (offset.left - elementOffset.left) * 0.5;
                        }
                        if (offset.left < elementOffset.left + elementWidth - childWidth) {
                            offset.left = (elementOffset.left + elementWidth - childWidth + offset.left) * 0.5;
                        }
                    }
                    return offset;
                }
            }).bind('mousedown.' + me.name, function () {
                child.stop();
                me.hideScrollbar();
            }),
            scrollbarVertical = $('<div class="wa-scrollable-scrollbar-vertical" style="display:none;"></div>').appendTo(me.element),
            scrollbarHorizontal = $('<div class="wa-scrollable-scrollbar-horizontal" style="display:none;"></div>').appendTo(me.element);
            me.isVertical = isVertical;
            me.isHorizontal = isHorizontal;
            $(document).bind('mouseup.' + me.name + me.guid, function () {
                if (child.is(':animated')) {
                    return;
                }
                offsetEnd = {
                    top: parseFloat(child.css('top')) || 0,
                    left: parseFloat(child.css('left')) || 0
                };
                if (isVertical && (offsetEnd.top > 0 || offsetEnd.top < (elementHeight - childHeight))) {
                    child.animate({
                        top: (offsetEnd.top > 0 ? 0 : elementHeight - childHeight) + 'px'
                    }, {
                        queue: false,
                        duration: 500,
                        easing: 'waScrollBezier',
                        complete: function () {
                            me.hideScrollbar();
                        },
                        step: function (now, fx) {
                            me.setScrollBarVerticalPosition(-1 * now * elementHeight / childHeight);
                        }
                    });
                }
                if (isHorizontal && (offsetEnd.left > 0 || offsetEnd.left < (elementWidth - childWidth))) {
                    child.animate({
                        left: (offsetEnd.left > 0 ? 0 : elementWidth - childWidth) + 'px'
                    }, {
                        queue: false,
                        duration: 500,
                        easing: 'waScrollBezier',
                        complete: function () {
                            me.hideScrollbar();
                        },
                        step: function (now, fx) {
                            me.setScrollBarHorizontalPosition(-1 * now * elementWidth / childWidth);
                        }
                    });
                }
            });
            me.child = child;
            this.ui = {};
            this.ui.scrollbarVertical = scrollbarVertical;
            this.ui.scrollbarHorizontal = scrollbarHorizontal;
        },
        stepHorizontal: function (now, fx) {
            var me = this, options = this.options;
            if (now > 0 || now < (me.elementWidth - me.childWidth)) {
                me.child.stop();
                var bound = options.boundThreshold * Math.abs(fx.end - now) / options.tripThreshold;
                me.child.animate({
                    left: (now > 0 ? bound : me.elementWidth - me.childWidth - bound) + 'px'
                }, {
                    duration: 200,
                    easing: 'waScrollBezier',
                    step: function (now) {
                        me.setScrollBarHorizontalPosition(-1 * now * me.elementWidth / me.childWidth);
                    }
                }).animate({
                    left: (now > 0 ? 0 : me.elementWidth - me.childWidth) + 'px'
                }, {
                    duration: 400,
                    easing: 'waScrollBezier',
                    complete: function () {
                        setTimeout(function () {
                            $(document).triggerHandler('mouseup');
                        }, 100);
                        me.hideScrollbar();
                    },
                    step: function (now) {
                        me.setScrollBarHorizontalPosition(-1 * now * me.elementWidth / me.childWidth);
                    }
                });
            } else {
                me.setScrollBarHorizontalPosition(-1 * now * me.elementWidth / me.childWidth);
            }
        },
        stepVertical: function (now, fx) {
            var me = this, options = this.options;
            if (now > 0 || now < (me.elementHeight - me.childHeight)) {
                me.child.stop();
                var bound = options.boundThreshold * Math.abs(fx.end - now) / options.tripThreshold;
                me.child.animate({
                    top: (now > 0 ? bound : me.elementHeight - me.childHeight - bound) + 'px'
                }, {
                    duration: 200,
                    easing: 'waScrollBezier',
                    step: function (now) {
                        me.setScrollBarVerticalPosition(-1 * now * me.elementHeight / me.childHeight);
                    }
                }).animate({
                    top: (now > 0 ? 0 : me.elementHeight - me.childHeight) + 'px'
                }, {
                    duration: 400,
                    easing: 'waScrollBezier',
                    complete: function () {
                        setTimeout(function () {
                            $(document).triggerHandler('mouseup');
                        }, 100);
                        me.hideScrollbar();
                    },
                    step: function (now) {
                        me.setScrollBarVerticalPosition(-1 * now * me.elementHeight / me.childHeight);
                    }
                });
            } else {
                me.setScrollBarVerticalPosition(-1 * now * me.elementHeight / me.childHeight);
            }
        },
        setScrollBarVerticalPosition: function (scrollbarOffsetTop) {
            if (scrollbarOffsetTop < 0) {
                scrollbarOffsetTop = scrollbarOffsetTop * this.childHeight / this.elementHeight;
                this.ui.scrollbarVertical.css({
                    height: Math.max((this.scrollbarHeight + scrollbarOffsetTop), 0) + 'px',
                    top: '0px'
                });
            } else if (scrollbarOffsetTop > this.elementHeight - this.scrollbarHeight) {
                scrollbarOffsetTop = (scrollbarOffsetTop - this.elementHeight + this.scrollbarHeight) * this.childHeight / this.elementHeight;
                this.ui.scrollbarVertical.css({
                    height: Math.max((this.scrollbarHeight - scrollbarOffsetTop), 0) + 'px',
                    top: this.elementHeight - this.scrollbarHeight + scrollbarOffsetTop + 'px'
                });
            } else {
                this.ui.scrollbarVertical.css({
                    top: scrollbarOffsetTop + 'px',
                    height: this.scrollbarHeight + 'px'
                });
            }
        },
        setScrollBarHorizontalPosition: function (scrollbarOffsetLeft) {
            if (scrollbarOffsetLeft < 0) {
                scrollbarOffsetLeft = scrollbarOffsetLeft * this.childWidth / this.elementWidth;
                this.ui.scrollbarHorizontal.css({
                    width: Math.max((this.scrollbarWidth + scrollbarOffsetLeft), 0) + 'px',
                    left: '0px'
                });
            } else if (scrollbarOffsetLeft > this.elementWidth - this.scrollbarWidth) {
                scrollbarOffsetLeft = (scrollbarOffsetLeft - this.elementWidth + this.scrollbarWidth) * this.childWidth / this.elementWidth;
                this.ui.scrollbarHorizontal.css({
                    width: Math.max((this.scrollbarWidth - scrollbarOffsetLeft), 0) + 'px',
                    left: this.elementWidth - this.scrollbarWidth + scrollbarOffsetLeft + 'px'
                });
            } else {
                this.ui.scrollbarHorizontal.css({
                    left: scrollbarOffsetLeft + 'px',
                    width: this.scrollbarWidth + 'px'
                });
            }
        },
        hideScrollbar: function () {
            var me = this;
            if (!me.scrollbarTimer) {
                me.scrollbarTimer = setTimeout(function () {
                    me.ui.scrollbarVertical.hide();
                    me.ui.scrollbarHorizontal.hide();
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
            if (this.isVertical && this.ui.scrollbarVertical.is(':hidden')) {
                this.ui.scrollbarVertical.show();
            }
            if (this.isHorizontal && this.ui.scrollbarHorizontal.is(':hidden')) {
                this.ui.scrollbarHorizontal.show();
            }
        },
        destroy: function () {
            this.child.unbind('.' + this.name).draggable('destroy');
            $(document).unbind('.' + this.name + this.guid);
            $.wa.base.prototype.destroy.call(this);
        }
    });
})(jQuery);