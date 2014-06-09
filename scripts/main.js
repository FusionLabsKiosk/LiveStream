//LiveStream Namespace
var live = {};
live.widgets = [];
live.widgetCount = 0;
live.location = {
    'city': 'Dallas'
};

live.PARALLAX_SPEED = 2;

/* Initialization */
$(document).ready(function() {
    live.initialize();
});
live.initialize = function() {
    sandbox.initialize();
    live.initializeParallax();
    live.initializeWidgets();
    live.initializeListeners();
};
live.initializeWidgets = function() {
    live.initializeWidget('defineLocation', $('section.viewport .top .main .widgets .location'));
    live.initializeWidget('wiki', $('section.viewport .top .secondary .widgets'));
    live.initializeWidget('maps', $('section.viewport .supplemental-widgets'));
    live.initializeWidget('timezone', $('section.viewport .supplemental-widgets'));
    live.initializeWidget('weather', $('section.viewport .supplemental-widgets'));
    //Disable places temporarily to save API calls
//    live.initializeWidget('dining');
//    live.initializeWidget('entertainment');
//    live.initializeWidget('shopping');
//    live.initializeWidget('travel');
//    live.initializeWidget('hotels');
//    live.initializeWidget('finance');
};
live.initializeWidget = function(widget, appendElement) {
    live.widgetCount++;
    $.get('widgets/' + widget + '/' + widget + '.html', function(data) {
        var ae = appendElement instanceof jQuery ? appendElement : $('#widgets');
        var w = new Widget(widget, data, ae).initialize();
        live.widgets.push(w);
        if (live.widgets.length === live.widgetCount) {
            live.widgetsLoaded();
        }
    });
};
live.widgetsLoaded = function() {
    loading.initialize();
    live.updateLocation();
};
live.initializeListeners = function() {
    
};
live.initializeParallax = function() {
    $('aside.middle').scroll(function() {
        var y = -($('aside.middle').scrollTop() / live.PARALLAX_SPEED);
        $('main.fullscreen').css('background-position', '50% ' + y + 'px');
    });
};

live.updateLocation = function() {
    var location = $('#location', defineLocation.v).val();
    geocoding.geocode(location, function(location) {
        live.location = location;
        for (var i = 0; i < live.widgets.length; i++) {
            live.widgets[i].js.setLocation(location);
        }
    });
    $('.city', defineLocation.w).html(location);
};

/* View Manipulation */
live.addView = function(selector, dontHide) {
    var left = $('main aside.left');
    var right = $('main aside.right');
    var leftVisible = left.hasClass('visible');
    var rightVisible = right.hasClass('visible');
    var added = false;
    
    if (left.find(selector).length > 0 && leftVisible) {
        if (!dontHide) {
            live.hideAside(left);
            leftVisible = false;
            added = false;
        }
    }
    else if (right.find(selector).length > 0 && rightVisible) {
        if (!dontHide) {
            live.hideAside(right);
            rightVisible = false;
            added = false;
        }
    }
    else if (!rightVisible) {
        live.setAside(right, selector);
        rightVisible = true;
        added = true;
    }
    else if (!leftVisible) {
        live.setAside(left, selector);
        leftVisible = true;
        added = true;
    }
    else {
        live.setAside(right, selector);
        rightVisible = true;
        added = true;
    }
    
    //TODO: Icon start/end is being called, but need to change widgets to icons
    if (leftVisible && rightVisible) {
        $('main aside.middle').addClass('icons');
        for (var i = 0; i < live.widgets.length; i++) {
            live.widgets[i].js.iconStart();
            live.widgets[i].js.widgetEnd();
        }
    }
    else if ($('main aside.middle').hasClass('icons')) {
        $('main aside.middle').removeClass('icons');
        for (var i = 0; i < live.widgets.length; i++) {
            live.widgets[i].js.iconEnd();
            live.widgets[i].js.widgetStart();
        }      
    }
    return added;
};
live.setAside = function(aside, selector) {
    live.hideAside(aside, function() {
        live.showAside(aside, selector);
    });
};
live.showAside = function(aside, selector) {
    aside.empty();
    aside.append(selector);
    aside.addClass('visible');
};
live.hideAside = function(aside, callback) {
    if (aside.hasClass('visible')) {
        aside.off('webkitTransitionEnd');
        aside.on('webkitTransitionEnd', function() {
            if (callback !== undefined) {
                callback();
            }
        });
        aside.removeClass('visible');
    }
    else if (callback !== undefined) {
        callback();
    }
};

live.setAsideViews = function(widget1, widget2) {
    widget1.widget.addView(true);
    widget2.widget.addView(true);
};

live.getExternalImage = function(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'blob';
    xhr.onload = function() {
        callback(window.URL.createObjectURL(xhr.response));
    };
    xhr.open('GET', url, true);
    xhr.send();
};
