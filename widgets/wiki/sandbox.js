var currentEvent;

function getWikiExtract(location) {        
    var param = {
        'action': 'query',
        'prop': 'extracts',
        'format': 'json',
        'exintro': true,
        'titles': location,
        'redirects': true,
        'callback': 'returnMessage'
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

function returnMessage(data) {
    var title = '';
    var extract = '';
    for (var key in data.query.pages) {
        title = data.query.pages[key].title;
        extract = data.query.pages[key].extract;
        break;
    }
    currentEvent.source.postMessage({
        'widget': 'wiki',
        'title': title,
        'extract': extract
    }, currentEvent.origin);
}

window.onload = function() {
    window.addEventListener('message', messageHandler);
};

function messageHandler(e) {
    currentEvent = e;
        
    if (e.data.widget === 'wiki') {
        if (e.data.loadedRequest) {
            currentEvent.source.postMessage({
                'widget': 'wiki',
                'loaded': true
            }, currentEvent.origin);
        }
        else {
            getWikiExtract(e.data.location);
        }
    }
}