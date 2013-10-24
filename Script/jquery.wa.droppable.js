/// <reference path="jquery.wa.core.js" />
/// <reference path="jquery.wa.widget.js" />
/// <reference path="jquery.wa.mouse.js" />
/// <reference path="jquery.wa.draggable.js" />

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
            tolerance: 'intersect',
            activate: function (event, draggable, inst) {
            },
            deactivate: function (event, draggable, inst) {
            },
            over: function (event, draggable, inst) {
            },
            out: function (event, draggable, inst) {
            },
            drop: function (event, draggable, inst) {
            }
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
            if (this._isConflict(draggable)) {
                return;
            }
            if (this.options.activeClass) {
                this.element.addClass(this.options.activeClass);
            }
            this._trigger('activate', event, draggable, this);
        },
        _deactivate: function (event) {
            var draggable = $.wa.ddmanager.current;
            if (this._isConflict(draggable)) {
                return;
            }
            if (this.options.activeClass) {
                this.element.removeClass(this.options.activeClass);
            }
            if (this.options.hoverClass) {
                this.element.removeClass(this.options.hoverClass);
            }
            this._trigger('deactivate', event, draggable, this);
        },
        _over: function (event) {
            var draggable = $.wa.ddmanager.current;
            if (this._isConflict(draggable)) {
                return;
            }
            if (this.options.hoverClass) {
                this.element.addClass(this.options.hoverClass);
            }
            this._trigger('over', event, draggable, this);
        },
        _out: function (event) {
            var draggable = $.wa.ddmanager.current;
            if (this._isConflict(draggable)) {
                return;
            }
            if (this.options.hoverClass) {
                this.element.removeClass(this.options.hoverClass);
            }
            this._trigger('out', event, draggable, this);
        },
        _drop: function (event) {
            var draggable = $.wa.ddmanager.current;
            if (this._isConflict(draggable)) {
                return;
            }
            this._trigger('drop', event, draggable, this);
        },
        _isConflict: function (draggable) {
            if (draggable.element[0] == this.element[0]) {
                return true;
            }
            return false;
        }
    });
})(jQuery);