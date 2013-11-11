/// <reference path="jquery.wa.core.js" />
/// <reference path="jquery.wa.widget.js" />
/// <reference path="jquery.wa.mouse.js" />
/// <reference path="jquery.wa.draggable.js" />

(function ($, undefined) {
    $.wa.widget('tilemenu', {
        options: {
            dataSource: [],
            tpl: '{text}',
            radius: 90,
            trayRadius: 104,
            duration: 400,
            delay: 300,
            showTray:true
        },
        _create: function () {
            var me = this, options = this.options, pole, html = [],offset;
            me.guid = $.wa.guid++;
            html.push('<div class="wa-tilemenu-pole" style="display:none;">');
            if (options.showTray) {
                html.push('<div class="wa-tilemenu-tray"></div>');
            }
            for (var i = 0; i < options.dataSource.length; i++) {
                html.push('<div class="wa-tilemenu-tile">');
                html.push(options.tpl.replace(/\{\S+?\}/g, function (match) {
                    return options.dataSource[i][match.replace(/\{|\}/g, '')];
                }));
                html.push('</div>');
            }
            html.push('<a class="wa-button wa-tilemenu-button-close">×</a>');
            html.push('</div>');
            offset = me.element.offset();
            pole = $(html.join('')).appendTo(document.body);
            pole.offset({
                left: offset.left + (me.element.outerWidth() - pole.outerWidth())/2,
                top: offset.top + (me.element.outerHeight() - pole.outerHeight()) / 2
            });
            me.btnClose = $('.wa-tilemenu-button-close', pole).bind('click', function (event) {
                event.stopPropagation();
                me._hideMenu();
            });
            me.tiles = $('.wa-tilemenu-tile', pole).bind('tap', function (event) {
                var $this = $(this);
                if (!$this.is(':animated')) {
                    var entity = options.dataSource[me.tiles.index($this)];
                    me._trigger('itemtap', event, entity);
                }
            }).draggable();
            me.tray = $('.wa-tilemenu-tray', me.ui.pole);
            me.element.bind('click.' + me.name, function () {
                me._showMenu();
            });
            me.ui = {};
            me.ui.pole = pole;
        },
        _showMenu: function () {
            if (this.ui.pole.is(':hidden')) {
                var me = this, options = this.options, arc = 2 * Math.PI / options.dataSource.length,
                currentArc = 0, delay = options.delay / options.dataSource.length, 
                currentDelay = 0;
                me.poleRadius=me.ui.pole.outerWidth();
                me.ui.pole.fadeIn(options.duration);
                if (options.showTray) {
                    me.tray.css({
                        'border-radius': options.trayRadius + me.poleRadius + 'px'
                    }).stop().animate({
                        left: -options.trayRadius + 'px',
                        right: -options.trayRadius + 'px',
                        top: -options.trayRadius + 'px',
                        bottom: -options.trayRadius + 'px'
                    }, {
                        duration: options.duration
                    });
                }
                me.tiles.each(function (index) {
                    var $this = $(this), tempDelay = currentDelay, tempArc = currentArc;
                    setTimeout(function () {
                        $this.css({
                            '-webkit-transform': 'rotate(360deg)'
                        });
                        $this.stop().animate({
                            left: (-options.radius * Math.sin(tempArc)).toFixed(10) + 'px',//IE7 IE8 will raise error for exponential notation
                            top: (-options.radius * Math.cos(tempArc)).toFixed(10) + 'px'
                        }, {
                            easing: 'swing',
                            duration: options.duration
                        });
                    }, tempDelay);
                    currentDelay += delay;
                    currentArc += arc;
                });
            }
        },
        _hideMenu: function () {
            if (!this.ui.pole.is(':hidden')) {
                var me = this, options=this.options,delay = me.options.delay / me.options.dataSource.length, currentDelay = 0;
                me.ui.pole.fadeOut(options.duration);
                if (options.showTray) {
                    me.tray.css({
                        'border-radius': me.poleRadius + 'px'
                    }).stop().animate({
                        left: '0px',
                        right: '0px',
                        top: '0px',
                        bottom: '0px'
                    }, {
                        duration: options.duration
                    });
                }
                me.tiles.each(function (index) {
                    var $this = $(this), tempDelay = currentDelay;
                    setTimeout(function () {
                        $this.css({
                            '-webkit-transform': 'rotate(0deg)'
                        });
                        $this.stop().animate({
                            left: '0px',
                            top: '0px'
                        }, {
                            easing: 'swing',
                            duration: options.duration
                        });
                    }, tempDelay);
                    currentDelay += delay;
                });
            }
        },
        destroy: function () {
            this.callParent();
        }
    });
})(jQuery);