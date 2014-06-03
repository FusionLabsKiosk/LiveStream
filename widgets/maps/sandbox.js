var map;

var currentLat;
var currentLng;

function initializeMap() {
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://maps.googleapis.com/maps/api/js?v=3.exp&sensor=false&' +
            'callback=drawMap';
    document.body.appendChild(script);
}
function drawMap() {
    map = new google.maps.Map(document.getElementById("map-canvas"), {
        'center': {
            'lat': currentLat,
            'lng': currentLng
        },
        'zoom': 13
    });
}

function updateMap(e) {
    if (e.data.widget === 'maps') {
        currentLat = parseFloat(e.data.lat);
        currentLng = parseFloat(e.data.lng);
        if (map === undefined) {
            initializeMap();
        }
        else {
            map.setCenter({
                'lat': currentLat,
                'lng': currentLng
            });
        }
    }
}

window.onload = function() {
    window.addEventListener('message', updateMap);
};