//Maps Namespace
var maps = {};

//Global Variables
maps.API_KEY = 'AIzaSyCEc-ILEMoraGX8sL0pMdgtfqSq2kOkleo';


maps.initialize = function() {
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
                geocoding.getLatLng(live.location, function(lat, lng) {
                    win.postMessage({
                        'lat': lat,
                        'lng': lng
                    }, '*');
                });
            }
        });
    }, 1000);
};