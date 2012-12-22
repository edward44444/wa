/// <reference path="jquery.wa.core.js" />
/// <reference path="jquery.wa.resizeable.js" />
/// <reference path="jquery.wa.dragable.js" />
$.wa.widget('openwindow', {
    options: {
        width: '100%',
        height: '100%',
        modal: true,
        title:'wa',
        url: 'http://www.baidu.com',
        refresh: true,
        showSimulate:true
    },
    resizeTimeOut:null,
    _create: function () {
        var me = this;
        this.element.bind('click.' + me.name, function () {
            me._open();
        });
    },
    _open: function () {
        var me = this;
        var html = [];
        var options = this.options;
        if (!options.refresh && me.ui && me.ui.openwindow) {
            me.ui.openwindow.show();
            if (options.modal) {
                me.ui.overlay.show();
            }
            return;
        }
        var width, height, left, top, zIndex = 2 + ($.wa.overlayZindex++);
        if (!isNaN(options.width)) {
            width = options.width + 'px';
        }else{
            width = options.width
        }
        if (!isNaN(options.height)) {
            height = options.height + 'px';
        }else{
            height = options.height
        }
        var openwindow = $('<div></div>').addClass('wa-window').css({
            width: width,
            height: height,
            'z-index': zIndex
        }).appendTo(document.body);
        openwindow.css({
            width: openwindow.width()+'px',
            height: openwindow.height()+'px'
        });
        html.push('<div class="wa-window-resize">');
        html.push('  <div class="wa-resize-top wa-window-resize-top"></div>');
        html.push('  <div class="wa-resize-top-left wa-window-resize-top-left"></div>');
        html.push('  <div class="wa-resize-top-right wa-window-resize-top-right"></div>');
        html.push('  <div class="wa-resize-bottom wa-window-resize-bottom"></div>');
        html.push('  <div class="wa-resize-bottom-left wa-window-resize-bottom-left"></div>');
        html.push('  <div class="wa-resize-bottom-right wa-window-resize-bottom-right"></div>');
        html.push('  <div class="wa-resize-left wa-window-resize-left"></div>');
        html.push('  <div class="wa-resize-right wa-window-resize-right"></div>');
        html.push('</div>');
        html.push('<div class="wa-window-inner">');
        html.push('  <div class="wa-window-header">');
        html.push('    <div class="wa-window-title">' + options.title + '</div>');
        html.push('    <div class="wa-window-tool">');
        html.push('      <a class="wa-window-button-close">×</a>');
        html.push('    </div>');
        html.push('  </div>');
        html.push('  <div class="wa-window-body">');
        html.push('      <iframe class="wa-window-iframe" frameborder="0"></iframe>');
        html.push('  </div>');
        html.push('</div>');
        openwindow.append(html.join(''));
        var windowInner = $('.wa-window-inner', openwindow),
            windowFrame = $('.wa-window-iframe', openwindow),
            windowHeader = $('.wa-window-header', openwindow),
            buttonClose = $('.wa-window-button-close', openwindow).
            bind('click.' + me.name, function () {
                me.hide();
            }).bind('mousedown.' + me.name, function (e) {
                e.preventDefault();
                e.stopPropagation();
            }), overlay;
        left = ($(window).width() - openwindow.width()) / 2;
        top = ($(window).height() - openwindow.height()) / 2;
        openwindow.offset({ left: left, top: top })
            .dragable({
                showSimulate: options.showSimulate,
                handle: '.wa-window-header'
            })
            .resizeable({ showSimulate: options.showSimulate })
            .bind('resize.' + me.name, function () {
                windowFrame.css({
                    height: (windowInner.height() - windowHeader.height()) + 'px',
                    width: windowInner.width() + 'px'
                });
            });
        openwindow.triggerHandler('resize.' + me.name);
        overlay = $('<div></div>').appendTo(document.body);
        me.guid = $.wa.guid++;
        if (options.modal) {
            overlay.css({
                'position': 'absolute',
                'width': Math.max($(document.body).width(),$(window).width()) + 'px',
                'height': Math.max($(document.body).height(),$(window).height()) + 'px',
                'opacity': 0.3,
                'z-index': zIndex-1,
                'background-color': '#000000',
                'left': '0px',
                'top': '0px'
            });
            $(window).bind('resize.' + me.name+me.guid, function () {
                //console.log('resize');
                // in Chrome reszie event will raise twice when resize window
                me.resizeTimeOut = setTimeout(function () {
                    overlay.css({
                        width: 0 + 'px',
                        height: 0 + 'px'
                    }).css({
                        'width': Math.max($(document.body).width(),$(window).width()) + 'px',
                        'height':Math.max($(document.body).height(),$(window).height()) + 'px'
                    });
                    clearTimeout(me.resizeTimeOut);
                }, 0);
            });
        }
        windowFrame.attr('src', options.url);
        this.ui={};
        this.ui.openwindow = openwindow;
        this.ui.overlay = overlay;
    },
    hide: function () {
        if (this.options.refresh) {
            this.ui.openwindow.remove();
            this.ui.overlay.remove();
            $(window).unbind('resize.' + this.name + this.guid);
        } else {
            this.ui.openwindow.hide();
            this.ui.overlay.hide();
        }
    },
    destroy: function () {
        this.element.unbind('.' + this.name);
        $(window).unbind('resize.' + this.name + this.guid);
        $.wa.base.prototype.destroy.call(this);
    }
});