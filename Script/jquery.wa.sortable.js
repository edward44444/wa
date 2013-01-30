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
            me.helper.css({
                position: 'absolute',
                width: me.helper.width() + 'px',
                height: me.helper.height() + 'px'
            });
            me.nextAll = me.placeHolder.nextAll().not(me.helper);
            me.prevAll = me.placeHolder.prevAll().not(me.helper);
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
            me.nextAll.each(function () {
                var $this = $(this);
                if (me._intersectNext($this)) {
                    me.placeHolder.insertAfter($this);
                    me.nextAll = me.placeHolder.nextAll().not(me.helper);
                    me.prevAll = me.placeHolder.prevAll().not(me.helper);
                    return false;
                }
            });
            me.prevAll.each(function () {
                var $this = $(this);
                if (me._intersectPrev($this)) {
                    me.placeHolder.insertBefore($this);
                    me.nextAll = me.placeHolder.nextAll().not(me.helper);
                    me.prevAll = me.placeHolder.prevAll().not(me.helper);
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
        _intersectNext: function (droppable) {
            var me = this,
                dropWidth = droppable.outerWidth(),
                dropHeight = droppable.outerHeight(),
                dropOffset = droppable.offset(),
                dragWidth = me.helper.outerWidth(),
                dragHeight = me.helper.outerHeight(),
                dragOffset = me.helper.offset();
            return (
                dragOffset.left + dragWidth / 2 < dropOffset.left + dropWidth
                && dragOffset.left + dragWidth / 2 > dropOffset.left
                && dragOffset.top < dropOffset.top + dropHeight
                && dragOffset.top + dragHeight > dropOffset.top + dropHeight);
        },
        _intersectPrev: function (droppable) {
            var me = this,
                dropWidth = droppable.outerWidth(),
                dropHeight = droppable.outerHeight(),
                dropOffset = droppable.offset(),
                dragWidth = me.helper.outerWidth(),
                dragHeight = me.helper.outerHeight(),
                dragOffset = me.helper.offset();
            return (
                dragOffset.left + dragWidth / 2 < dropOffset.left + dropWidth
                && dragOffset.left + dragWidth / 2 > dropOffset.left
                && dragOffset.top + dragHeight > dropOffset.top
                && dragOffset.top < dropOffset.top);
        },
        destroy: function () {
            this.element.removeClass('wa-sortable');
            this._mouseDestroy();
        }
    });
})(jQuery);