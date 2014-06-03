/* Places Sandbox */
var places = {};
places.service;
places.event;
places.pagination = {};
var placesService;

places.messageHandler = function(e, initialized) {
    places.event = e;
    if (places.service === undefined) {
        initializePlacesScript(true);
    }
    else {
        initialized = true;
    }
    
    if (initialized) {
        if (e.data.reference !== undefined) {
            places.getDetails(e.data.reference);
        }
        else {
            places.getNearbySearch(e.data.location, e.data.options);
        }
    }
};
places.getNearbySearch = function(location, options) {
    if (options.pageKey === undefined) {
        var request = {
            'location': {
                'lat': location.lat,
                'lng': location.lng
            },
            'radius': 5000
        };
        for (var key in options) {
            request[key] = options[key];
        }
        places.service.nearbySearch(request, function(results, status, pages) {
            var pageKey = 0;
            if (pages.hasNextPage) {
                pageKey = Math.floor((Math.random() * 5000) + 1);
                places.pagination[pageKey] = pages;
            }

            var resultsCopy = [];
            for (var i = 0; i < results.length; i++) {
                resultsCopy.push(places.createPlaceResultMessage(results[i]));
            }
            places.event.source.postMessage({
                'widget': places.event.data.widget,
                'results': resultsCopy,
                'status': status,
                'hasNextPage': pages.hasNextPage,
                'pageKey': pageKey
            }, places.event.origin);
        });
    }
    else if (places.pagination[options.pageKey] !== undefined) {
        places.pagination[options.pageKey].nextPage();
        delete places.pagination[options.pageKey];
    }
};
places.getDetails = function(reference) {
    var request = {
        'reference': reference
    };
    places.service.getDetails(request, function(result, status) {
        var resultCopy = places.createPlaceResultMessage(result);
        places.event.source.postMessage({
            'widget': places.event.data.widget,
            'result': deepCopySafeMessage(resultCopy),
            'status': status
        }, places.event.origin);
    });
};
places.createPlaceResultMessage = function(result) {
    var copy = deepCopySafeMessage(result);
    if (copy.photos === undefined) {
        copy.photos = [];
    }
    for (var j = 0; j < copy.photos.length; j++) {
        copy.photos[j].url = result.photos[j].getUrl({
            'maxWidth': copy.photos[j].width,
            'maxHeight': copy.photos[j].height
        });
    }
    return copy;
};

/* Wiki Sandbox */
var wiki = {};
wiki.event;
wiki.messageHandler = function(e) {
    wiki.event = e;
    wiki.getExtract(e.data.location);
};

wiki.getExtract = function(location) {        
    var param = {
        'action': 'query',
        'prop': 'extracts',
        'format': 'json',
        'exintro': true,
        'titles': location,
        'redirects': true,
        'callback': 'wiki.postMessage'
    };
    var url = [];
    url.push('http://en.wikipedia.org/w/api.php?');
    for (var key in param) {
        url.push(key);
        url.push('=');
        url.push(param[key]);
        url.push('&');
    }
    url.pop();

    var script = document.getElementById('jsonp');
    if (script !== null) {
        document.body.removeChild(script);
    }
    script = document.createElement('script');
    script.id = 'jsonp';
    script.src = url.join('');
    document.body.appendChild(script);
};

wiki.postMessage = function(data) {
    var title = '';
    var extract = '';
    for (var key in data.query.pages) {
        title = data.query.pages[key].title;
        extract = data.query.pages[key].extract;
        break;
    }
    wiki.event.source.postMessage({
        'widget': wiki.event.data.widget,
        'title': title,
        'extract': extract
    }, wiki.event.origin);
};

/* Sandbox Script Initialization */
function initializePlacesScript(init) {
    if (init) {
        initializeScript('http://maps.googleapis.com/maps/api/js?libraries=places&sensor=false&callback=initializePlacesScript');
    }
    else {
        places.service = new google.maps.places.PlacesService(document.createElement('places-service'));
        places.messageHandler(places.event, true);
    }
};

function initializeScript(url) {
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;
    document.body.appendChild(script);
}

window.onload = function() {
    window.addEventListener('message', messageHandler);
};

function messageHandler(e) {
    if (e.data.loadCheck) {
        e.source.postMessage({
            'loaded': true
        }, e.origin);
    }
    else if (e.data.script === 'places') {
        places.messageHandler(e);
    }
    else if (e.data.script === 'wiki') {
        wiki.messageHandler(e);
    }
}

/* Used to remove functions when passing an object with window.postMessage */
function deepCopySafeMessage(object) {
    return JSON.parse(JSON.stringify(object));
}