/// <reference path="jquery.wa.core.js" />
/// <reference path="jquery.wa.mouse.js" />

(function ($, undefined) {
    $.wa.widget('sortable', $.wa.mouse, {
        options: {
        },
        _create: function () {
            var me = this, options = this.options;
            me.element.addClass('wa-sortable');
            me._mouseInit();
        },
        _mouseStart: function (event) {
            var me = this;
            me.helper = $(event.target).closest('.wa-sortable>*');
            me.helperOffset = me.helper.offset();
            me.placeHolder = me.helper.clone().empty().css({
                visibility: 'hidden'
            }).addClass('wa-sortable-placeholder').insertAfter(me.helper);
            me.helperOriStyle = me.helper.attr('style');
            me.helper.css({
                position: 'absolute',
                width: me.helper.width() + 'px',
                height: me.helper.height() + 'px'
            });
            me.siblings = me.helper.siblings('li:not(".wa-sortable-placeholder")');
            me.mouseRelativeLeft = event.pageX - me.helperOffset.left;
            me.mouseRelativeTop = event.pageY - me.helperOffset.top;
        },
        _mouseDrag: function (event) {
            var me = this, left, top;
            left = event.pageX - me.mouseRelativeLeft;
            top = event.pageY - me.mouseRelativeTop;
            me.helper.offset({
                left: left,
                top: top
            });
            me.siblings.each(function () {
                var $this = $(this);
                if (me._intersect($(this), 'intersect')) {
                    if ($this.prevAll().index(me.helper) == -1) {
                        me.placeHolder.insertBefore($this);
                    } else {
                        me.placeHolder.insertAfter($this);
                    }
                    return false;
                }
            });
        },
        _mouseStop: function (event) {
            var me = this;
            me.helper.insertAfter(me.placeHolder).removeAttr('style');
            me.placeHolder.remove();
        },
        _mouseCapture: function (event) {
            if (this.element[0] == event.target) {
                return false;
            }
            return true;
        },
        _intersect: function (droppable, tolerance) {
            var me = this;
            var dropWidth = droppable.outerWidth(),
                dropHeight = droppable.outerHeight(),
                dropOffset = droppable.offset(),
                dragWidth = me.helper.outerWidth(),
                dragHeight = me.helper.outerHeight(),
                dragOffset = me.helper.offset();
            if (tolerance == 'intersect') {
                return (
                  dragOffset.left + dragWidth / 2 < dropOffset.left + dropWidth
                  && dragOffset.left + dragWidth / 2 > dropOffset.left
                  && dragOffset.top + dragHeight / 2 < dropOffset.top + dropHeight
                  && dragOffset.top + dragHeight / 2 > dropOffset.top
                );
            }
            return false;
        },
        destroy: function () {
            this.element.removeClass('wa-sortable');
            this._mouseDestroy();
        }
    });
})(jQuery);