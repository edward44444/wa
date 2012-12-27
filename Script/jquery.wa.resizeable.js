/// <reference path="jquery-1.7.1.js" />
/// <reference path="jquery.wa.dragable.js" />
/// <reference path="jquery.wa.core.js" />
$.wa.widget('resizeable', {
	options: {
	    resizeN: '.wa-resize-top',
	    resizeS: '.wa-resize-bottom',
	    resizeW: '.wa-resize-left',
	    resizeE: '.wa-resize-right',
	    resizeNE: '.wa-resize-top-right',
	    resizeNW: '.wa-resize-top-left',
	    resizeSE: '.wa-resize-bottom-right',
	    resizeSW: '.wa-resize-bottom-left',
	    showSimulate: true,
	    container: null,
	    minWidth: 80,
        minHeight:80
	},
	_create: function () {
	    this.control = {};
	    var me = this, options = this.options, container,
            resizeN = $(options.resizeN, me.element),
            resizeS = $(options.resizeS, me.element),
            resizeW = $(options.resizeW, me.element),
            resizeE = $(options.resizeE, me.element),
            resizeNE = $(options.resizeNE, me.element),
            resizeNW = $(options.resizeNW, me.element),
            resizeSE = $(options.resizeSE, me.element),
            resizeSW = $(options.resizeSW, me.element);
	    me.element.addClass('wa-resize');
	    if (!resizeN.length) {
	        resizeN = $('<div></div>').addClass(options.resizeN.replace(/\./, '')).appendTo(me.element);
	        me.resizeNAdd = true;
	    }
	    if (!resizeS.length) {
	        resizeS = $('<div></div>').addClass(options.resizeS.replace(/\./, '')).appendTo(me.element);
	        me.resizeSAdd = true;
	    }
	    if (!resizeW.length) {
	        resizeW = $('<div></div>').addClass(options.resizeW.replace(/\./, '')).appendTo(me.element);
	        me.resizeWAdd = true;
	    }
	    if (!resizeE.length) {
	        resizeE = $('<div></div>').addClass(options.resizeE.replace(/\./, '')).appendTo(me.element);
	        me.resizeEAdd = true;
	    }
	    if (!resizeNE.length) {
	        resizeNE = $('<div></div>').addClass(options.resizeNE.replace(/\./, '')).appendTo(me.element);
	        me.resizeNEAdd = true;
	    }
	    if (!resizeNW.length) {
	        resizeNW = $('<div></div>').addClass(options.resizeNW.replace(/\./, '')).appendTo(me.element);
	        me.resizeNWAdd = true;
	    }
	    if (!resizeSE.length) {
	        resizeSE = $('<div></div>').addClass(options.resizeSE.replace(/\./, '')).appendTo(me.element);
	        me.resizeSEAdd = true;
	    }
	    if (!resizeSW.length) {
	        resizeSW = $('<div></div>').addClass(options.resizeSW.replace(/\./, '')).appendTo(me.element);
	        me.resizeSWAdd = true;
	    }
	    me.control.resizeN = resizeN.disableSelection();
	    me.control.resizeS = resizeS.disableSelection();
	    me.control.resizeW = resizeW.disableSelection();
	    me.control.resizeE = resizeE.disableSelection();
	    me.control.resizeNE = resizeNE.disableSelection();
	    me.control.resizeNW = resizeNW.disableSelection();
	    me.control.resizeSE = resizeSE.disableSelection();
	    me.control.resizeSW = resizeSW.disableSelection();
	    if (options.container == 'parent') {
	        container = me.element.parent();
	    } else {
	        container =options.container|| $(document.body);
	    }
	    me.container = container;
	    me.variables = {
	        borderLeftWidth: parseInt(me.element.css('border-left-width')),
	        borderRightWidth: parseInt(me.element.css('border-right-width')),
	        borderBottomWidth: parseInt(me.element.css('border-bottom-width')),
	        borderTopWidth: parseInt(me.element.css('border-top-width'))
	    };
	    resizeN.css('cursor', 'n-resize');
	    me._bindEvent(resizeN, 'n');
	    resizeS.css('cursor', 's-resize');
	    me._bindEvent(resizeS, 's');
	    resizeW.css('cursor', 'w-resize');
	    me._bindEvent(resizeW, 'w');
	    resizeE.css('cursor', 'e-resize');
	    me._bindEvent(resizeE, 'e');
	    resizeNE.css('cursor', 'ne-resize');
	    me._bindEvent(resizeNE,'ne');
	    resizeNW.css('cursor', 'nw-resize');
	    me._bindEvent(resizeNW,'nw');
	    resizeSE.css('cursor', 'se-resize');
	    me._bindEvent(resizeSE,'se');
	    resizeSW.css('cursor', 'sw-resize');
	    me._bindEvent(resizeSW,'sw');
	},
	_bindEvent: function (target, orient) {
	    var me = this, options = this.options, elementOffset, elementWidth, elementHeight,
            simulate, overlay, simulateOffset, simulateBorderWidth = 1,resizeTarget,
            mouseRelativeLeft, mouseRelativeTop, left, top;
	    var containerWidth,
            containerHeight,
            containerOffset,
            borderLeftWidth = me.variables.borderLeftWidth,
            borderRightWidth = me.variables.borderLeftWidth,
            borderBottomWidth = me.variables.borderLeftWidth,
            borderTopWidth = me.variables.borderLeftWidth
	    target.bind('mouseover.' + me.name, function (e) {
            target.unbind('mousedown.' + me.name).bind('mousedown.' + me.name, function (e) {
                //$(document.body).overlay({ opacity: 0.0 });
                overlay = $('<div></div>').css({
                    "position": "absolute",
                    "zIndex": (4 + $.wa.overlayZindex),
                    "width": $(document.body).width() + "px",
                    "height": $(document.body).height() + "px",
                    "background-color": '#000000',
                    "opacity": 0,
                    'left': '0px',
                    'top':'0px'
                }).appendTo(document.body);
                containerWidth = me.container.width();
                containerHeight = me.container.height();
                containerOffset = me.container.offset();
                elementOffset = me.element.offset();
                elementWidth = me.element.width();
                elementHeight = me.element.height();
                if (options.showSimulate == true) {
                    resizeTarget = simulate = $("<div></div>").css({
                        "position": "absolute",
                        "zIndex": 10000,
                        "width": elementWidth + borderLeftWidth + borderRightWidth + "px",
                        "height": elementHeight + borderTopWidth + borderBottomWidth + "px",
                        "border": "1px dashed #000000"
                    }).appendTo('body').offset({ left: elementOffset.left - 1, top: elementOffset.top - 1 });
                } else {
                    resizeTarget = me.element;
                }
                mouseRelativeLeft = e.pageX - elementOffset.left;
                mouseRelativeTop = e.pageY - elementOffset.top;
                $(document).bind('mousemove.' + me.name, function (e) {
                    e.preventDefault();
                    left = e.pageX - mouseRelativeLeft;
                    top = e.pageY - mouseRelativeTop;
                    if (orient.indexOf('s') > -1) {
                        top = Math.max(top, elementOffset.top - elementHeight + options.minHeight);
                        top = Math.min(top, containerOffset.top + containerHeight - elementHeight - simulateBorderWidth * 2);
                        resizeTarget.height(elementHeight + top - elementOffset.top);
                    }
                    if (orient.indexOf('n') > -1) {
                        top = Math.min(top, elementOffset.top + elementHeight - options.minHeight);
                        top = Math.max(top, containerOffset.top + simulateBorderWidth * 2);
                        resizeTarget.offset({ top: top - (resizeTarget == me.element ? 0 : simulateBorderWidth) });
                        resizeTarget.height(elementHeight + elementOffset.top - top);
                    }
                    if (orient.indexOf('w') > -1) {
                        left = Math.min(left, elementOffset.left + elementWidth - options.minWidth);
                        left = Math.max(left, containerOffset.left + simulateBorderWidth * 2);
                        resizeTarget.offset({ left: left - (resizeTarget == me.element ? 0 : simulateBorderWidth) });
                        resizeTarget.width(elementWidth + elementOffset.left - left);
                    }
                    if (orient.indexOf('e') > -1) {
                        left = Math.max(left, elementOffset.left - elementWidth + options.minWidth);
                        left = Math.min(left, containerOffset.left + containerWidth - elementWidth - simulateBorderWidth * 2);
                        resizeTarget.width(elementWidth + left - elementOffset.left);
                    }
                    if (resizeTarget == me.element) {
                        me.element.triggerHandler('resize');
                    }
                }).bind('mouseup.' + me.name, function (e) {
                    overlay.remove();
                    $(document).unbind('mousemove.' + me.name).unbind('mouseup.' + me.name);
                    if (options.showSimulate == true) {
                        var simulateOffset = simulate.offset();
                        me.element.width(simulate.width());
                        me.element.height(simulate.height());
                        me.element.offset({ left: simulateOffset.left + simulateBorderWidth, top: simulateOffset.top + simulateBorderWidth });
                        simulate.remove();
                        me.element.triggerHandler('resize');
                    }
                });
            }).bind('mouseout.' + me.name, function (e) {
                target.unbind('mousedown.' + me.name);
            });
        });
	},
	destroy: function () {
	    var me = this;
	    me.element.removeClass('wa-resize');
	    for (var pro in me.control) {
	        me.control[pro].unbind('.' + me.name).enableSelection();
	        if (me[pro + 'Add']) {
	            me.control[pro].remove();
	        }
	    }
	}
});