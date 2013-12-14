/// <reference path="jquery.wa.core.js" />
/// <reference path="jquery.wa.widget.js" />

(function ($, undefined) {
    $.wa.widget('tooltip', {
        options: {
            title: '',
            showHeader: true,
            width: null,
            height: null,
            offsetX: 10,
            offsetY: 10,
            content: '',
            trackMouse: false,
            autoHidden: true
        },
        _create: function () {
            var me = this, options = this.options, pageX, pageY;
            me.element.bind('mouseover.' + me.name, function (event) {
                me.showTooltip();
                if (options.trackMouse) {
                    me.mousePageX = event.pageX;
                    me.mousePageY = event.pageY;
                    me.oriTooltipOffset = me.ui.tooltip.offset();
                    me.element.unbind('mousemove.' + me.name).bind('mousemove.' + me.name, function (event) {
                        me.moveTooltip(event);
                    });
                }
            });
            if (options.autoHidden) {
                me.element.bind('mouseout.' + me.name, function () {
                    me.hideTooltip();
                });
            }
            me.ui = {};
        },
        moveTooltip: function (event) {
            var me = this, offset = me.oriTooltipOffset;
            me.ui.tooltip.offset({
                left: offset.left + event.pageX - me.mousePageX,
                top: offset.top + event.pageY - me.mousePageY
            });
        },
        showTooltip: function () {
            var me = this, options = this.options, html = [], tooltip, offset, left, top;
            if (!me.ui.tooltip) {
                html.push('<label class="wa-tooltip" style="display: none;">');
                if (options.showHeader) {
                    html.push('<div class="wa-tooltip-header" style="width:0px;">');
                    html.push('<div class="wa-tooltip-title">');
                    html.push(options.title);
                    html.push('</div>');
                    html.push('<div class="wa-tooltip-tool">');
                    html.push('<a class="wa-tooltip-botton-close">×</a>');
                    html.push('</div>');
                    html.push('</div>');
                }
                html.push('<div class="wa-tooltip-body">');
                html.push(options.content);
                html.push('</div>');
                html.push('</label>');
                tooltip = $(html.join('')).appendTo(document.body);
                if (options.width) {
                    tooltip.css({
                        width: options.width + 'px'
                    });
                }
                if (options.height) {
                    tooltip.css({
                        height: options.height + 'px'
                    });
                }
                me.btnClose = $('.wa-tooltip-botton-close', tooltip).bind('click', function () {
                    me.hideTooltip();
                });
                me.ui.tooltip = tooltip;
            } else {
                if (!me.ui.tooltip.parent().length) {
                    me.ui.tooltip.appendTo(document.body);
                }
            }
            offset = me.element.offset();
            left = offset.left + me.element.outerWidth() + options.offsetX;
            top = offset.top + me.element.outerHeight() + options.offsetY;
            if (left + me.ui.tooltip.outerWidth() > $(window).width()) {
                left = offset.left - me.ui.tooltip.outerWidth() - options.offsetX;
            }
            if (top + me.ui.tooltip.outerHeight() > $(window).height()) {
                top = offset.top - me.ui.tooltip.outerHeight() - options.offsetY;
            }
            // width bug in IE6,IE7
            $('.wa-tooltip-header', me.ui.tooltip).width(me.ui.tooltip.width());

            me.ui.tooltip.show().offset({ left: left, top: top });
        },
        hideTooltip: function () {
            this.ui.tooltip.detach();
        },
        destroy: function () {
            this.callParent();
        }
    });
})(jQuery);