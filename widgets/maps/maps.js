//Maps Namespace
var maps = {};

//Global Variables
maps.API_KEY = 'AIzaSyCEc-ILEMoraGX8sL0pMdgtfqSq2kOkleo';


maps.initialize = function() {
    $('<iframe/>').attr('src', 'widgets/maps/sandbox.html').appendTo(maps.w);
    $('<iframe/>').attr('src', 'widgets/maps/sandbox.html').appendTo(maps.v);
    maps.updateMaps();
};

maps.start = function() {
    maps.updateMaps();
};

maps.end = function() {
    maps.updateMaps();
};

maps.updateMaps = function() {
    setTimeout(function() {
        maps.wv.find('iframe').each(function() {
            var win = this.contentWindow;
            if (win !== null) {
                geocoding.getLatLng(live.location.city, function(lat, lng) {
                    win.postMessage({
                        'widget': 'maps',
                        'lat': lat,
                        'lng': lng
                    }, '*');
                });
            }
        });
    }, 1000);
};