/// <reference path="jquery.wa.core.js" />

/// All property shoud declare use this or the property will in prototype
$.wa.widget('overlay',{
    options: {
        opacity: 0.3,
        zIndex: 10001,
        attachWindowResize:false
    },
    overlay:null,
    resizeTimeOut: null,
    ui:{},
    _create: function () {
        var me = this;
        var overlay = $('<div></div>').appendTo(document.body);
        var position, width, height;
        width = this.element.width();
        height = this.element.height();
        if (this.element.get(0) == window || this.element.get(0) == document) {
            position = { left: 0, top: 0, borderLeftWidth: 0, borderTopWidth: 0 };  
        } else {
            position = this.element.offset();
            position.borderLeftWidth = parseInt(this.element.css('border-left-width'));
            position.borderTopWidth = parseInt(this.element.css('border-top-width'));
        }
        if (me.element.is('body')) {
            //width = Math.max(me.element.width(), $(window).width());
            //height = Math.max(me.element.height(), $(window).height());
            width = me.element.width();
            height = me.element.height();
        }
        overlay.css({
            'position': 'absolute',
            'width': width + 'px',
            'height': height + 'px',
            'opacity': this.options.opacity,
            'z-index': (this.options.zIndex?this.options.zIndex:$.wa.overlayZindex++),
            'background-color': '#000000',
            'left': position.left + position.borderLeftWidth + 'px',
            'top': position.top + position.borderTopWidth + 'px'
        });
        me.element.bind('resize.' + me.name, function () {
            // in Chrome reszie event will raise twice when resize window
            me.resizeTimeOut = setTimeout(function () {
                overlay.css({
                    width: 0 + 'px',
                    height: 0 + 'px'
                }).css({
                    'width': me.element.width() + 'px',
                    'height': me.element.height() + 'px'
                });
                clearTimeout(me.resizeTimeOut);
            }, 0);
            //if (me.element.is('body')) {
            //    me.resizeTimeOut = setTimeout(function () {
            //        overlay.css({
            //            width: 0 + 'px',
            //            height: 0 + 'px'
            //        }).css({
            //            'width': Math.max(me.element.width(), $(window).width()) + 'px',
            //            'height': Math.max(me.element.height(), $(window).height()) + 'px'
            //        });
            //        clearTimeout(me.resizeTimeOut);
            //    }, 0);
            //} else {
            //    me.resizeTimeOut = setTimeout(function () {
            //        overlay.css({
            //            width: 0 + 'px',
            //            height: 0 + 'px'
            //        }).css({
            //            'width': me.element.width() + 'px',
            //            'height': me.element.height() + 'px'
            //        });
            //        clearTimeout(me.resizeTimeOut);
            //    }, 0);
            //}
        });
        if (me.options.attachWindowResize) {
            $(window).bind('resize.' + me.name, function () {
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