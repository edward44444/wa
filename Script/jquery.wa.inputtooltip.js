/// <reference path="jquery.wa.core.js" />
/// <reference path="jquery.wa.widget.js" />

(function ($, undefined) {
    $.wa.widget('inputtooltip', {
        options: {
            width: null,
            height: null,
            position:'top',
            content: ''
        },
        _create: function () {
            var me = this, options = this.options;
            me.element.bind('focus.' + me.name, function () {
                me.showTooltip();
            }).bind('blur.' + me.name, function () {
                me.hideTooltip();
            });
            me.ui = {};
        },
        showTooltip: function (event) {
            var me = this, options = this.options, html = [], tooltip, offset, left, top;
            if (!me.ui.tooltip) {
                html.push('<div class="wa-inputtooltip" style="display: none;">');
                html.push('<div class="wa-inputtooltip-inner">');
                html.push(options.content);
                html.push('</div>');
                html.push('<div class="wa-arrow">');
                html.push('</div>');
                html.push('</div>');
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
                me.ui.tooltip = tooltip;
            } else {
                if (!me.ui.tooltip.parent().length) {
                    me.ui.tooltip.appendTo(document.body);
                }
            }
            me.ui.tooltip.show();
            var arrow = $('.wa-arrow', me.ui.tooltip);
            offset = me.element.offset();
            left = offset.left;
            top = offset.top;
            if (options.position == 'top') {
                arrow.addClass('wa-inputtooltip-arrow-down');
                top = top - me.ui.tooltip.outerHeight() - arrow.outerHeight();
                left = left + (me.element.outerWidth() - me.ui.tooltip.outerWidth()) / 2;
            } else if (options.position == 'bottom') {
                arrow.addClass('wa-inputtooltip-arrow-bottom');
                top = top + me.element.outerHeight() + arrow.outerHeight();
                left = left + (me.element.outerWidth() - me.ui.tooltip.outerWidth()) / 2;
            } else if (options.position == 'left') {
                arrow.addClass('wa-inputtooltip-arrow-left');
                left = left + me.element.outerWidth() + arrow.outerWidth();
                top = top + (me.element.outerHeight() - me.ui.tooltip.outerHeight()) / 2;
            }
            else if (options.position == 'right') {
                arrow.addClass('wa-inputtooltip-arrow-right');
                left = left - me.ui.tooltip.outerWidth() - arrow.outerWidth();
                top = top + (me.element.outerHeight() - me.ui.tooltip.outerHeight()) / 2;
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