(function ($) {
    $.fn.Jdragable = function (opts) {
        opts = $.extend({}, $.fn.Jdragable.defaults, opts);
        return this.each(function () {
            Dragable(this, opts);
        });
    }
    var dragableID = 0;
    var $document = $(document);
    var Dragable = function (select, o) {
        var $select = $(select), $container = null;
        var $handle = null;
        if (o.handle) {
            $handle = $(o.handle, $select);
        }
        if (!($handle != null && $handle.length > 0)) {
            $handle = $select;
        }
        if (o.containment == 'parent') {
            $container = $select.parent();
        } else {
            $container = $document
        }
        var id = select.id || 'Jdragable-' + dragableID++;
        var containerOffset = $container.offset();
        if (containerOffset == null) {
            containerOffset = { left: 0, top: 0 };
        }
        var containerWidth = $container.width();
        var containerHeight = $container.height();
        var selectOffset = null;
        var width = $select.width();
        var height = $select.height();
        var $overlay = null;
        var $selectSimulate = null;
        $handle.css({ 'cursor': 'move' }).bind('mouseover', function (e) {
            $handle.unbind('mousedown.' + id).bind('mousedown.' + id, function (e) {
                $overlay = $("<div></div>").css({ "position": "absolute", "zIndex": 9999, "top": "0px", "right": "0px", "bottom": "0px", "left": "0px", "background-color": "White", "opacity": 0.5 });
                $overlay.appendTo('body');
                selectOffset = $select.offset();
                if (o.showSimulate == true) {
                    $selectSimulate = $("<div></div>").css({ "position": "absolute", "zIndex": 10000, "left": selectOffset.left + "px", "top": selectOffset.top + "px", "width": width - 2 + "px", "height": height - 2 + "px", "border": "1px dashed #000000" });
                    $selectSimulate.appendTo('body');
                }
                var mouseRelativeLeft = e.pageX - selectOffset.left;
                var mouseRelativeTop = e.pageY - selectOffset.top;
                if (select.setCapture) {
                    select.setCapture();
                } else if (window.captureEvents) {
                    window.captureEvents(Event.MOUSEMOVE | Event.MOUSEUP);
                }
                $document.bind('mousemove.' + id, function (e) {
                    var left, top;
                    left = e.pageX - mouseRelativeLeft;
                    top = e.pageY - mouseRelativeTop;
                    if (o.containment) {
                        left = left < containerOffset.left ? containerOffset.left : left;
                        left = left > containerOffset.left + containerWidth - width ? containerOffset.left + containerWidth - width : left;
                        top = top < containerOffset.top ? containerOffset.top : top;
                        top = top > containerOffset.top + containerHeight - height ? containerOffset.top + containerHeight - height : top;
                    }
                    //$('#div4').text($select.position().left + '-' + $select.offset().left + '-' + $select.position().top + '-' + $select.offset().top);
                    if (o.axis == 'x') {
                        left = selectOffset.left;
                    } else if (o.axis == 'y') {
                        top = selectOffset.top;
                    }
                    if (o.showSimulate == true) {
                        //$selectSimulate.css({ left: left + 'px', top: top + 'px' });
                        $selectSimulate.offset({ left: left, top: top });
                    } else {
                        //$select.css({ left: left + 'px', top: top + 'px' });
                        $select.offset({ left: left, top: top });
                    }
                }).bind('mouseup.' + id, function (e) {
                    $handle.unbind('mousedown.' + id);
                    $document.unbind('mousemove.' + id).unbind('mouseup.' + id);
                    if (select.releaseCapture) {
                        select.releaseCapture();
                    } else if (window.releaseEvents) {
                        window.releaseEvents(Event.MOUSEMOVE | Event.MOUSEUP);
                    }
                    $overlay.remove();
                    if (o.showSimulate == true) {
                        var selectSimulateOffset = $selectSimulate.offset();
                        $select.offset({ left: selectSimulateOffset.left, top: selectSimulateOffset.top });
                        $selectSimulate.remove();
                    }
                });
            });
        });
        return $select;
    };
    $.fn.Jdragable.defaults = {
        containment: 'parent', //'parent or document
        showSimulate: false,
        handle: null,
        axis: null
    };
})(jQuery);