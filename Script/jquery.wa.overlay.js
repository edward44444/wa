/// <reference path="jquery.wa.core.js" />
/// All property shoud declare use this or the property will in prototype
$.wa.widget('overlay',{
    options: {
        opacity: 0.3,
        zIndex: 10001,
        attachWindowResize:false
    },
    _create: function () {
        this.guid = $.wa.guid++;
        var me = this, options = this.options, overlay,
            position, width, height;
        width = this.element.outerWidth();
        height = this.element.outerHeight();
        position = this.element.offset() || { left: 0, top: 0 };
        overlay=$('<div></div>').appendTo(document.body).css({
            'position': 'absolute',
            'width': width + 'px',
            'height': height + 'px',
            'opacity': options.opacity,
            'z-index': (options.zIndex ?options.zIndex : $.wa.overlayZindex++),
            'background-color': '#000000',
            'left': position.left + 'px',
            'top': position.top + 'px'
        });
        me.element.bind('resize.' + me.name, function () {
            // in some browser, reszie event will raise twice when resize window
            if (!me.resizeTimerId) {
                me.resizeTimerId = setTimeout(function () {
                    overlay.css({
                        width: 0 + 'px',
                        height: 0 + 'px'
                    }).css({
                        'width': me.element.outerWidth() + 'px',
                        'height': me.element.outerHeight() + 'px'
                    });
                    clearTimeout(me.resizeTimerId);
                    me.resizeTimerId = null;
                }, 0);
            }
        });
        if (me.options.attachWindowResize) {
            $(window).bind('resize.' + me.name+me.guid, function () {
                me.element.triggerHandler('resize.' + me.name);
            });
        }
        this.ui = {};
        this.ui.overlay = overlay;
        this.element.addClass('has-wa-overlay'); 
    },
    overlay: function () {
        return this.ui.overlay;
    },
    _reset: function () {
        this.destroy();
        this._create();
    },
    destroy: function () {
        $(window).unbind('.' + this.name + this.guid);
        this.element.removeClass('has-wa-overlay');
        $.wa.base.prototype.destroy.call(this);
    },
    hide: function () {
        this.ui.overlay.hide();
    },
    show: function () {
        this.ui.overlay.show();
    }
});
$.fn.hasOverlay = function () {
    var returnValue = false;
    this.each(function () {
        if ($(this).is('.has-wa-overlay')) {
            returnValue = true;
            return false;
        }
    });
    return returnValue;
}