//LiveStream Namespace
var live = {};
live.widgets = [];
live.location = {
    'city': 'Dallas'
};

/* Initialization */
$(document).ready(function() {
    live.initialize();
});
live.initialize = function() {
    sandbox.initialize();
    live.initializeWidgets();
    live.initializeListeners();
    live.updateLocation();
};
live.initializeWidgets = function() {
    //live.initializeWidget('demo');
    live.initializeWidget('timezone');
    live.initializeWidget('weather');
    live.initializeWidget('maps');
    live.initializeWidget('wiki');
    live.initializeWidget('food'); //Disable temporarily to save API calls
};
live.initializeWidget = function(widget) {
    $.get('widgets/' + widget + '/' + widget + '.html', function(data) {
        var w = new Widget(widget, data).initialize();
        live.widgets.push(w);
    });
};
live.initializeListeners = function() {
    $('#location').keypress(function(e) {
        if (e.which === 13) {
            live.updateLocation();
        }
    });
};

live.updateLocation = function() {
    geocoding.geocode($('#location').val(), function(location) {
        live.location = location;
        for (var i = 0; i < live.widgets.length; i++) {
            live.widgets[i].js.setLocation(location);
        }
    });
};

/* View Manipulation */
live.addView = function(selector) {
    var left = $('main aside.left');
    var right = $('main aside.right');
    var leftVisible = left.hasClass('visible');
    var rightVisible = right.hasClass('visible');
    var added;
    
    if (left.find(selector).length > 0 && leftVisible) {
        live.hideAside(left);
        leftVisible = false;
        added = false;
    }
    else if (right.find(selector).length > 0 && rightVisible) {
        live.hideAside(right);
        rightVisible = false;
        added = false;
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

live.getExternalImage = function(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'blob';
    xhr.onload = function() {
        callback(window.URL.createObjectURL(xhr.response));
    };
    xhr.open('GET', url, true);
    xhr.send();
};