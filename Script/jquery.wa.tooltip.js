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
		var me = this, options = this.options;
		me.element.bind('mouseover.' + me.name, function (event) {
			me.showTooltip();
		});
		if (options.autoHidden) {
			me.element.bind('mouseout.' + me.name, function () {
				me.hideTooltip();
			});
		}
		me.ui = {};
	},
	showTooltip: function () {
		var me = this, options = this.options, html = [], tooltip, offset, left, top;
		if (!me.ui.tooltip) {
			html.push('<div class="wa-tooltip" style="display: none;">');
			html.push('<div class="wa-tooltip-resize">');
			html.push('<div class="wa-tooltip-resize-top"></div>');
			html.push('<div class="wa-tooltip-resize-top-left"></div>');
			html.push('<div class="wa-tooltip-resize-top-right"></div>');
			html.push('<div class="wa-tooltip-resize-bottom"></div>');
			html.push('<div class="wa-tooltip-resize-bottom-left"></div>');
			html.push('<div class="wa-tooltip-resize-bottom-right"></div>');
			html.push('<div class="wa-tooltip-resize-left"></div>');
			html.push('<div class="wa-tooltip-resize-right"></div>');
			html.push('</div>');
			html.push('<div class="wa-tooltip-inner">');
			if (options.showHeader) {
				html.push('<div class="wa-tooltip-header">');
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
		me.ui.tooltip.show().offset({ left: left, top: top });
	},
	hideTooltip: function () {
		this.ui.tooltip.hide();
		//this.ui.tooltip.remove();
		this.ui.tooltip.detach();
	},
	destroy: function () {
		this.element.unbind('.' + this.name);
		$.wa.base.prototype.destroy.call(this);
	}
});