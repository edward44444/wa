/// <reference path="jquery.wa.core.js" />
/// <reference path="jquery.wa.mouse.js" />
/// <reference path="jquery.wa.widget.js" />

(function ($, undefined) {
    if (!$.wa.support.touch) {
        return;
    }
    function simulateMouseEvent(event, eventType) {
        // Ignore multi-touch events
        if (event.originalEvent.touches.length > 1) {
            return;
        }
        event.preventDefault();
        var touch = event.originalEvent.changedTouches[0],
            simulatedEvent = document.createEvent('MouseEvents');
        // Initialize the simulated mouse event using the touch event's coordinates
        simulatedEvent.initMouseEvent(
          eventType,    // type
          true,             // bubbles                    
          true,             // cancelable                 
          window,           // view                       
          1,                // detail                     
          touch.screenX,    // screenX                    
          touch.screenY,    // screenY                    
          touch.clientX,    // clientX                    
          touch.clientY,    // clientY                    
          false,            // ctrlKey                    
          false,            // altKey                     
          false,            // shiftKey                   
          false,            // metaKey                    
          0,                // button                     
          null              // relatedTarget              
        );
        // Dispatch the simulated event to the target element
        event.target.dispatchEvent(simulatedEvent);
    }
    var mouseProto = $.wa.mouse.prototype, _mouseInit = mouseProto._mouseInit, touchHandled;
    mouseProto._touchStart = function (event) {
        var me = this;
        if (touchHandled || !me._mouseCapture(event)) {
            return;
        }
        touchHandled = true;
        me._touchMoved = false;
        simulateMouseEvent(event, 'mouseover');
        simulateMouseEvent(event, 'mousemove');
        simulateMouseEvent(event, 'mousedown');
    };
    mouseProto._touchMove = function (event) {
        if (!touchHandled) {
            return;
        }
        this._touchMoved = true;
        simulateMouseEvent(event, 'mousemove');
    };
    mouseProto._touchEnd = function (event) {
        if (!touchHandled) {
            return;
        }
        simulateMouseEvent(event, 'mouseup');
        simulateMouseEvent(event, 'mouseout');
        if (!this._touchMoved) {
            simulateMouseEvent(event, 'click');
        }
        touchHandled = false;
    };
    mouseProto._mouseInit = function () {
        var me = this;
        me.element.bind('touchstart', function (event) {
            me._touchStart(event);
        }).bind('touchmove', function (event) {
            me._touchMove(event);
        }).bind('touchend', function (event) {
            me._touchEnd(event);
        });
        _mouseInit.call(me);
    };
})(jQuery);