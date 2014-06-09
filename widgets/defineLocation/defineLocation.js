//Location Namespace
var defineLocation = {};

//Global Variables
defineLocation.VIEW_LOCATIONS = [
    'San Francisco',
    'Dallas',
    'Los Angeles',
    'Denver',
    'Chicago',
    'New York',
    'London',
    'Beijing'
];

defineLocation.initialize = function() {
    $('#location', defineLocation.v).keypress(function(e) {
        if (e.which === 13) {
            live.updateLocation();
        }
    });
};

defineLocation.setLocation = function(location) {
     
};

defineLocation.viewStart = function() {
    //location.showViewLoading();
    setTimeout(function() {
        //location.hideViewLoading();
    }, 2000);
    console.log('View Started');    
};
defineLocation.viewEnd = function() {
    console.log('View Ended');    
};
defineLocation.widgetStart = function() {
    console.log('Widget Started');    
};
defineLocation.widgetEnd = function() {
    console.log('Widget Ended');
};
defineLocation.iconStart = function() {
    console.log('Icon Started');
};
defineLocation.iconEnd = function() {
    console.log('Icon Ended');
};