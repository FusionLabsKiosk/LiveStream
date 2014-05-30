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
    geocoding.geocode('Dallas', function(location) {
        live.location = location;
    });
    live.initializeWidgets();
    live.initializeListeners();
};
live.initializeWidgets = function() {
    live.initializeWidget('demo');
    live.initializeWidget('timezone');
    live.initializeWidget('maps');
    live.initializeWidget('wiki');
    live.initializeWidget('weather');
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
            geocoding.geocode($('#location').val(), function(location) {
                live.location = location;
                for (var i = 0; i < live.widgets.length; i++) {
                    live.widgets[i].js.setLocation(location);
                    live.widgets[i].js.end();
                }
            });
        }
    });
};

/* View Manipulation */
live.addView = function(selector) {
    var left = $('main aside.left');
    var right = $('main aside.right');
    var leftVisible = left.is(':visible');
    var rightVisible = right.is(':visible');
    var added;
    
    if (left.find(selector).length > 0) {
        live.hideAside(left);
        leftVisible = false;
        added = false;
    }
    else if (right.find(selector).length > 0) {
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
    aside.append(selector);
    aside.show(200);
};
live.hideAside = function(aside, callback) {
    aside.hide(200, function() {
        aside.empty();
        if (callback !== undefined) {
            callback();
        }
    });
};