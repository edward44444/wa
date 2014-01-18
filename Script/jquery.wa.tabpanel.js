/// <reference path="jquery.wa.core.js" />
/// <reference path="jquery.wa.widget.js" />

(function ($, undefined) {
	$.wa.widget('tabpanel', {
	    options: {

		},
		_create: function () {
		    var me = this,options=me.options;
			me.tabbar = $('<div class="wa-tabpanel-bar"><ul class="wa-tabpanel-tabs"></ul></div>').appendTo(me.element).find('.wa-tabpanel-tabs');
			me.panels = [];
			me.tabs = [];
			me.activeIndex = 0;
			me.addTab(options);
		},
		addTab: function (options) {
		    var me = this;
		    for (var i = 0; i < me.panels.length; i++) {
		        if ($('.wa-tabpanel-iframe', me.panels[i]).attr('src') == options.url) {
		            if ($('.wa-tabpanel-anchor', me.tabs[i]).attr('tabindex') != me.activeIndex) {
		                $('.wa-tabpanel-anchor', me.tabs[i]).triggerHandler('click');
		            }
		            return;
		        }
		    }
		    if (me.panels.length) {
		        me.panels[me.activeIndex].hide();
		        me.tabs[me.activeIndex].removeClass('wa-tabpanel-tab-active');
		    }
		    var tab = $('<li class="wa-tabpanel-tab wa-tabpanel-tab-active"><a class="wa-button wa-tabpanel-button-close" title="close">×</a><a class="wa-tabpanel-anchor">' + options.title + '</a></li>').appendTo(me.tabbar);
		    var panel = $('<div class="wa-tabpanel-panel" title="' + options.title + '"><iframe class="wa-tabpanel-iframe" style="height:0px;width:0px;" scrolling="auto" frameborder="0"></iframe></div>').appendTo(me.element);
		    var panelFrame = $('.wa-tabpanel-iframe', panel);
		    var anchor = $('.wa-tabpanel-anchor', tab).bind('click', function () {
		        var $this = $(this), tabIndex = $this.attr('tabindex');
		        if (me.activeIndex == tabIndex) {
		            return;
		        }

		        me.panels[me.activeIndex].hide();
		        me.tabs[me.activeIndex].removeClass('wa-tabpanel-tab-active');
		        me.activeIndex = tabIndex;
		        me.panels[me.activeIndex].show();
		        me.tabs[me.activeIndex].addClass('wa-tabpanel-tab-active');
			    me.element.triggerHandler('resize');
		    });
		    var buttonClose = $('.wa-tabpanel-button-close', tab).bind('click', function (event) {
		        event.stopPropagation();
		        if ($('>.wa-tabpanel-tab', me.tabbar).length <= 1) {
		            return;
		        }
		        var $anchor = $('.wa-tabpanel-anchor', $(this).parent()), tabIndex = $anchor.attr('tabindex');
		        me.panels[tabIndex].remove();
		        me.tabs[tabIndex].remove(); 
		        if (me.activeIndex == tabIndex) {
		            me.activeIndex--;
		            if (me.activeIndex < 0) {
		                me.activeIndex = me.activeIndex+2;
		            }
		            me.panels[me.activeIndex].show();
		            me.tabs[me.activeIndex].addClass('wa-tabpanel-tab-active');
		            me.element.triggerHandler('resize');
		        }
		        for (var i = tabIndex + 1; i < me.tabs.length; i++) {
		            $('.wa-tabpanel-anchor', me.tabs[i]).attr('tabindex', $('.wa-tabpanel-anchor', me.tabs[i]).attr('tabindex') - 1);
		        }
		        me.panels.splice(tabIndex, 1);
		        me.tabs.splice(tabIndex, 1);
		        if (me.activeIndex >= tabIndex) {
		            me.activeIndex--;
		        }
		    });
			me.element.bind('resize.' + me.name, function () {
			    $('>.wa-tabpanel-iframe', me.panels[me.activeIndex]).css({
			        width: me.element.width() + 'px',
			        height: Math.max(me.element.height() - me.tabbar.outerHeight(true), 0) + 'px'
			    });
			});
			panelFrame.attr('src', options.url);
			me.panels.push(panel);
			me.tabs.push(tab);
			me.activeIndex = me.panels.length - 1;
			anchor.attr('tabindex', me.panels.length - 1);
			me.element.triggerHandler('resize');
		},
		destroy: function () {
			this.callParent();
		}
	});
})(jQuery);