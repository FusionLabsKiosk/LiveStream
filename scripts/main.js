//LiveStream Namespace
var live = {};
live.widgets = {};
live.location = 'Dallas';

/* Initialization */
$(document).ready(function() {
    live.initialize();
});
live.initialize = function() {
    live.initializeWidgets();
    live.initializeListeners();
};
live.initializeWidgets = function() {
    live.initializeWidget('timezone');
    live.initializeWidget('maps');
    live.initializeWidget('wiki');
    live.initializeWidget('weather');
};
live.initializeWidget = function(widget) {
    $.get('widgets/' + widget + '/' + widget + '.html', function(data) {
        var w = new Widget(widget, data).initialize();
        live.widgets[widget] = w;
        //TODO: Need better start()/end() logic
        w.setEndButton($('#return'));
    });
};
live.initializeListeners = function() {
    $('#location').keypress(function(e) {
        if (e.which === 13) {
            live.location = $('#location').val();
            for (var key in live.widgets) {
                live.widgets[key].js.end();
            }
        }
    });
};

/* View Manipulation */
live.addView = function(selector) {
    var left = $('main aside.left');
    var right = $('main aside.right');
    if (left.find(selector).length > 0) {
        live.hideAside(left);
    }
    else if (right.find(selector).length > 0) {
        live.hideAside(right);
    }
    else if (!right.is(':visible')) {
        live.setAside(right, selector);
    }
    else if (!left.is(':visible')) {
        live.setAside(left, selector);
    }
    else {
        live.setAside(right, selector);
    }
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