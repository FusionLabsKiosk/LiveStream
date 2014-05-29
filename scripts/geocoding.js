//Geocoding Namespace
var geocoding = {};

geocoding.API_KEY = 'AIzaSyCEc-ILEMoraGX8sL0pMdgtfqSq2kOkleo';

geocoding.getLatLng = function(address, callback) {
    if (typeof address !== 'string') {
        return;
    }
    $.ajax('https://maps.googleapis.com/maps/api/geocode/json', {
        'data': {
            'address': address,
            'sensor': false,
            'key': geocoding.API_KEY
        }
    }).success(function(data) {
        var lat = 0;
        var lng = 0;
        var address = '';
        if (data.results.length > 0) {
            lat = data.results[0].geometry.location.lat;
            lng = data.results[0].geometry.location.lng;
            address = data.results[0].formatted_address;
            
            if (callback !== undefined) {
                callback(lat, lng, address);
            }
        }
    });
};