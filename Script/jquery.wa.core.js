// All property shoud declare use this or the property will in prototype

(function ($, undefined) {
    $.wa = {};
    var div = document.createElement("div");
    $.wa.support = {};
    $.wa.support.selectstart = "onselectstart" in div;
    $.wa.support.touch = 'ontouchend' in document;
    $.fn.disableSelection = function () {
        return this.bind(($.wa.support.selectstart ? "selectstart" : "mousedown") +
            ".wa-disableSelection", function (event) {
                event.preventDefault();
            });
    };
    $.fn.enableSelection = function () {
        return this.unbind(".wa-disableSelection");
    }
    $.wa.cubicBezier = function (p0, p1, p2, p3, t) {
        return {
            x: p0.x * Math.pow((1 - t), 3) + p1.x * 3 * t * Math.pow((1 - t), 2) + p2.x * 3 * (1 - t) * Math.pow(t, 2) + p3.x * Math.pow(t, 3),
            y: p0.y * Math.pow((1 - t), 3) + p1.y * 3 * t * Math.pow((1 - t), 2) + p2.y * 3 * (1 - t) * Math.pow(t, 2) + p3.y * Math.pow(t, 3)
        };
    }
    function GetBezierY(array, start, end, x) {
        var index = Math.floor((start + end) / 2), x1, x2, y1, y2;
        if (array[index].x >= x) {
            if (array[index - 1].x <= x) {
                x1 = array[index - 1].x;
                y1 = array[index - 1].y;
                x2 = array[index].x;
                y2 = array[index].y;
                return x * (y2 - y1) / (x2 - x1) + (x1 * y2 - x2 * y1) / (x1 - x2);
            } else {
                return GetBezierY(array, start, index, x);
            }
        } else {
            if (array[index + 1].x >= x) {
                //return array[index].x + '-' + array[index + 1].x;
                x1 = array[index].x;
                y1 = array[index].y;
                x2 = array[index + 1].x;
                y2 = array[index + 1].y;
                return x * (y2 - y1) / (x2 - x1) + (x1 * y2 - x2 * y1) / (x1 - x2);
            } else {
                return GetBezierY(array, index, end, x);
            }
        }
    }
    $.wa.getBezierY = function (array, x) {
        return GetBezierY(array, 0, array.length - 1, x);
    }
    //$.wa.guid = function () {
    //    var now = new Date();
    //    return '' + now.getFullYear() + now.getMonth() + now.getDate() + now.getHours() + now.getMinutes() + now.getSeconds() + now.getMilliseconds() + parseInt($.guid++);
    //}
    $.wa.guid = 1;
    $.wa.overlayZindex = 1;
})(jQuery);