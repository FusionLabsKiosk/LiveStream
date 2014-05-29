
var currentLat;
var currentLng;

function initializeMap(lat, lng) {
    currentLat = lat;
    currentLng = lng;
    
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://maps.googleapis.com/maps/api/js?v=3.exp&sensor=false&' +
            'callback=drawMap';
    document.body.appendChild(script);
}
function drawMap() {
    var mapOptions = {
        center: new google.maps.LatLng(currentLat, currentLng),
        zoom: 8
    };
    var map = new google.maps.Map(document.getElementById("map-canvas"),
            mapOptions);
}


function messageHandler(e) {
    initializeMap(e.data.lat, e.data.lng);
};

window.onload = function() {
    window.addEventListener('message', messageHandler);
};