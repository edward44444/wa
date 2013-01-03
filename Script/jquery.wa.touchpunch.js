(function ($) {
    $.wa.widget('touchpunch', {
        _create: function () {
            var me = this,touchMoved;
            me.element.bind('touchstart.' + me.name, function (event) {
                touchMoved = false;
                me.simulateMouseEvent(event, 'mouseover');
                me.simulateMouseEvent(event, 'mousedown');
            }).bind('touchmove.' + me.name, function (event) {
                touchMoved = true;
                me.simulateMouseEvent(event, 'mousemove');
            }).bind('touchend.' + me.name, function (event) {
                me.simulateMouseEvent(event, 'mouseout');
                me.simulateMouseEvent(event, 'mouseup');
                if (touchMoved) {
                    me.simulateMouseEvent(event, 'click');
                }
            });
        },
        simulateMouseEvent: function (event, eventType) {
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
    });
})(jQuery);