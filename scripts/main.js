//LiveStream Namespace
var live = {};
live.widgets = {};

/* Initialization */
$(document).ready(function() {
    live.initialize();
});
live.initialize = function() {
    live.initializeWidgets();
    live.initializeListeners();
    live.setMainWidgets();
};
live.initializeWidgets = function() {
    live.initializeWidget('demo');
    live.initializeWidget('timezone');
};
live.initializeWidget = function(widget) {
    $.get('widgets/' + widget + '/' + widget + '.html', function(data) {
        var w = new Widget(widget, data);
        live.widgets[widget] = w;
        w.initialize();
    });
};
live.initializeListeners = function() {
    $('#return').click(function() {
        live.setMainWidgets();
    });
};

/* View Manipulation */
live.setMain = function(selector) {
    $('#hidden').append($('main.fullscreen').children());
    $('main.fullscreen').empty();
    $('main.fullscreen').append(selector);
};
live.setMainWidgets = function() {
    live.setMain($('#widgets'));
};

/* Test Functions */
live.alert = function() {
    $('main.fullscreen').css('background-color', 'red');
    setTimeout(function() {
        $('main.fullscreen').css('background-color', 'blue');
    }, 500);
};
