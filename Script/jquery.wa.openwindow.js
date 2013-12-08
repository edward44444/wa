/// <reference path="jquery.wa.core.js" />
/// <reference path="jquery.wa.widget.js" />
/// <reference path="jquery.wa.mouse.js" />
/// <reference path="jquery.wa.resizable.js" />
/// <reference path="jquery.wa.draggable.js" />

(function ($, undefined) {
    $.wa.widget('openwindow', {
        options: {
            width: '100%',
            height: '100%',
            modal: true,
            title: 'wa',
            url: 'http://www.baidu.com',
            refresh: true,
            helper: true
        },
        _create: function () {
            var me = this;
            this.element.bind('click.' + me.name, function () {
                me._open();
            });
        },
        _open: function () {
            this.guid = $.wa.guid++;
            var me = this, html = [], options = this.options;
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
            } else {
                width = options.width
            }
            if (!isNaN(options.height)) {
                height = options.height + 'px';
            } else {
                height = options.height
            }
            var openwindow = $('<div></div>').addClass('wa-window').css({
                width: width,
                height: height,
                'z-index': zIndex
            }).appendTo(document.body);
            // when width or height unit is % resize browser window will resize openwindow
            openwindow.css({
                width: openwindow.width() + 'px',
                height: openwindow.height() + 'px'
            });
            html.push('<div class="wa-window-header">');
            html.push('    <div class="wa-window-title">' + options.title + '</div>');
            html.push('    <div class="wa-window-tool">');
            html.push('      <a class="wa-window-button wa-window-button-close" title="close">×</a>');
            html.push('      <a class="wa-window-button wa-window-button-max" title="maximize">#</a>');
            html.push('      <a class="wa-window-button wa-window-button-min" title="minimize">-</a>');
            html.push('    </div>');
            html.push('</div>');
            html.push('<div class="wa-window-body">');
            html.push('    <iframe class="wa-window-iframe" style="height:0px;width:0px;" scrolling="auto" frameborder="0"></iframe>');
            html.push('</div>');
            openwindow.append(html.join(''));
            var windowBody = $('.wa-window-body', openwindow),
                windowFrame = $('.wa-window-iframe', openwindow),
                windowHeader = $('.wa-window-header', openwindow);
            var buttonClose = $('.wa-window-button-close', openwindow)
               .bind('click.' + me.name, function () {
                   me.hide();
               });
            var oriOffset, oriWidth, oriHeight, oriHeightMinimize;
            var buttonMax = $('.wa-window-button-max', openwindow);
            windowBody.css({
                width: openwindow.width() - 20 + 'px',
                height: openwindow.height() - 50 + 'px'
            });
            buttonMax.bind('click', function () {
                if (buttonMin.is('.wa-window-button-expand')) {
                    return;
                }
                var $this = $(this);
                if ($this.is('.wa-window-button-restore')) {
                    openwindow.offset(oriOffset).css({
                        width: oriWidth,
                        height: oriHeight
                    });
                    $this.removeClass('wa-window-button-restore');
                } else {
                    oriOffset = openwindow.offset();
                    oriWidth = openwindow.width();
                    oriHeight = openwindow.height();
                    openwindow.offset({
                        left: 0,
                        top: 0
                    }).css({
                        width: $(window).width() + 'px',
                        height: $(window).height() + 'px'
                    });
                    $this.addClass('wa-window-button-restore');
                }
                openwindow.triggerHandler('resize.' + me.name);
            });
            var buttonMin = $('.wa-window-button-min', openwindow);
            buttonMin.bind('click', function () {
                var $this = $(this);
                if ($this.is('.wa-window-button-expand')) {
                    openwindow.css({ height: oriHeightMinimize + 'px' });
                    $this.removeClass('wa-window-button-expand');
                } else {
                    oriHeightMinimize = openwindow.height();
                    openwindow.css({ height: windowHeader.outerHeight(true) + 'px' });
                    $this.addClass('wa-window-button-expand');
                }
                openwindow.triggerHandler('resize.' + me.name);
            });
            buttonClose.add(buttonMin).add(buttonMax).bind('mousedown.' + me.name, function (e) {
                e.preventDefault();
                e.stopPropagation();
            })
            left = ($(window).width() - openwindow.width()) / 2;
            top = ($(window).height() - openwindow.height()) / 2;
            openwindow.offset({ left: left, top: top })
                .draggable({
                    helper: options.helper,
                    container: $(document.body),
                    handle: '.wa-window-header'
                })
                .resizable({ helper: options.helper })
                .bind('resize.' + me.name, function () {
                    windowFrame.css({
                        height: windowBody.height() + 'px',
                        width: windowBody.width() + 'px'
                    });
                });
            openwindow.triggerHandler('resize.' + me.name);
            //windowFrame.bind('load', function () {
            //    windowFrame.css({
            //        height: windowBody.height() + 'px',
            //        width: windowBody.width() + 'px'
            //    });
            //});
            var overlay = $('<div></div>').appendTo(document.body);
            if (options.modal) {
                overlay.css({
                    'position': 'absolute',
                    'width': Math.max($(document.body).width(), $(window).width()) + 'px',
                    'height': Math.max($(document.body).height(), $(window).height()) + 'px',
                    'opacity': 0.3,
                    'z-index': zIndex - 1,
                    'background-color': '#000000',
                    'left': '0px',
                    'top': '0px'
                });
                $(window).bind('resize.' + me.name + me.guid, function () {
                    //console.log('resize');
                    // in Chrome reszie event will raise twice when resize window
                    if (!me.resizeTimerId) {
                        me.resizeTimerId = setTimeout(function () {
                            overlay.css({
                                width: 0 + 'px',
                                height: 0 + 'px'
                            }).css({
                                'width': Math.max($(document.body).width(), $(window).width()) + 'px',
                                'height': Math.max($(document.body).height(), $(window).height()) + 'px'
                            });
                            clearTimeout(me.resizeTimerId);
                            me.resizeTimerId = null;
                        }, 0);
                    }
                });
            }
            windowFrame.attr('src', options.url);
            this.ui = {};
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
            $(window).unbind('resize.' + this.name + this.guid);
            this.callParent();
        }
    });
})(jQuery);