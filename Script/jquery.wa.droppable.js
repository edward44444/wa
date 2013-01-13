/// <reference path="jquery.wa.core.js" />
/// <reference path="jquery.wa.draggable.js" />
/// <reference path="jquery.wa.mouse.js" />

(function ($, undefined) {
    $.wa.intersect = function (draggable, droppable, tolerance) {
        var dropWidth = droppable.element.outerWidth(),
        dropHeight = droppable.element.outerHeight(),
        dropOffset = droppable.element.offset(),
        dragWidth = draggable.helper.outerWidth(),
        dragHeight = draggable.helper.outerHeight(),
        dragOffset = draggable.helper.offset();
        if (tolerance == 'intersect') {
            return (
              dragOffset.left + dragWidth / 2 < dropOffset.left + dropWidth
              && dragOffset.left + dragWidth / 2 > dropOffset.left
              && dragOffset.top + dragHeight / 2 < dropOffset.top + dropHeight
              && dragOffset.top + dragHeight / 2 > dropOffset.top
            );
        }
        return false;
    }
    $.wa.ddmanager = {
        droppables: { 'default': [] },
        dragStart: function (draggable, event) {
            $.each($.wa.ddmanager.droppables[draggable.options.scope], function () {
                if (!this.accept.call(this.element[0], draggable.element)) {
                    return true;
                }
                this._activate(event);
            });
        },
        drop: function (draggable, event) {
            var dropped = false;
            $.each($.wa.ddmanager.droppables[draggable.options.scope], function () {
                if (!this.accept.call(this.element[0], draggable.element)) {
                    return true;
                }
                if ($.wa.intersect(draggable, this, this.options.tolerance)) {
                    this._drop(event);
                    dropped = true;
                }
            });
            return dropped;
        },
        drag: function (draggable, event) {
            $.each($.wa.ddmanager.droppables[draggable.options.scope], function () {
                if (!this.accept.call(this.element[0], draggable.element)) {
                    return true;
                }
                if ($.wa.intersect(draggable, this, this.options.tolerance)) {
                    if (!this.isOver) {
                        this._over(event);
                        this.isOver = true;
                    }
                } else {
                    if (this.isOver) {
                        this._out(event);
                        this.isOver = false;
                    }
                }

            });
        },
        dragStop: function (draggable, event) {
            $.each($.wa.ddmanager.droppables[draggable.options.scope], function () {
                if (!this.accept.call(this.element[0], draggable.element)) {
                    return true;
                }
                this._deactivate(event);
            });
        }
    }
    $.wa.widget('droppable', {
        options: {
            accept: '*',
            scope: 'default',
            activeClass: false,
            hoverClass: false,
            tolerance: 'intersect'
        },
        _create: function () {
            var me = this, options = this.options, accept = options.accept;
            this.accept = $.isFunction(accept) ? accept : function (element) {
                return element.is(accept);
            };
            $.wa.ddmanager.droppables[options.scope] = $.wa.ddmanager.droppables[options.scope] || [];
            $.wa.ddmanager.droppables[options.scope].push(me);
        },
        _activate: function (event) {
            var draggable = $.wa.ddmanager.current;
            if (draggable.element[0] == this.element[0]) {
                return;
            }
            if (this.options.activeClass) {
                this.element.addClass(this.options.activeClass);
            }
            this.draggable = draggable;
            this._trigger('activate', event, this);
        },
        _deactivate: function (event) {
            var draggable = $.wa.ddmanager.current;
            if (draggable.element[0] == this.element[0]) {
                return;
            }
            if (this.options.activeClass) {
                this.element.removeClass(this.options.activeClass);
            }
            if (this.options.hoverClass) {
                this.element.removeClass(this.options.hoverClass);
            }
            this.draggable = draggable;
            this._trigger('deactivate', event, this);
        },
        _over: function (event) {
            var draggable = $.wa.ddmanager.current;
            if (draggable.element[0] == this.element[0]) {
                return;
            }
            if (this.options.hoverClass) {
                this.element.addClass(this.options.hoverClass);
            }
            this.draggable = draggable;
            this._trigger('over', event, this);
        },
        _out: function (event) {
            var draggable = $.wa.ddmanager.current;
            if (draggable.element[0] == this.element[0]) {
                return;
            }
            if (this.options.hoverClass) {
                this.element.removeClass(this.options.hoverClass);
            }
            this.draggable = draggable;
            this._trigger('out', event, this);
        },
        _drop: function (event) {
            var draggable = $.wa.ddmanager.current;
            if (draggable.element[0] == this.element[0]) {
                return;
            }
            this.draggable = draggable;
            this._trigger('drop', event, this);
        }
    });
})(jQuery);