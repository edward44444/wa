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
            trackMouse: true,
            autoHidden: true
        },
        _create: function () {
            var me = this, options = this.options, pageX, pageY;
            me.element.bind('mouseover.' + me.name, function (event) {
                if (options.trackMouse) {
                    me.element.unbind('mousemove.' + me.name).bind('mousemove.' + me.name, function (event) {
                        me.moveTooltip(event);
                    });
                }
                me.showTooltip(event);
            });
            if (options.autoHidden) {
                me.element.bind('mouseout.' + me.name, function () {
                    me.hideTooltip();
                });
            }
            me.ui = {};
        },
        moveTooltip: function (event) {
            var me = this,left = event.pageX + me.options.offsetX;
            if (left + me.ui.tooltip.outerWidth() > $(window).width()) {
                left = event.pageX - me.ui.tooltip.outerWidth() - me.options.offsetX;
            }
            me.ui.tooltip.offset({
                left: left
            });
        },
        showTooltip: function (event) {
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
                    // the label style position will set to inline after apend to document in IE
                    me.ui.tooltip.appendTo(document.body);
                }
            }
            me.ui.tooltip.show();

            // width bug in IE6,IE7
            $('.wa-tooltip-header', me.ui.tooltip).width(me.ui.tooltip.width());

            if (options.trackMouse) {
                me.moveTooltip(event);
                return;
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
            me.ui.tooltip.offset({ left: left, top: top });
        },
        hideTooltip: function () {
            //this.ui.tooltip.hide();
            this.ui.tooltip.detach();
        },
        destroy: function () {
            this.callParent();
        }
    });
})(jQuery);