var currentEvent;

function getWikiExtract(e) {
    if (e.data.widget === 'wiki') {
        currentEvent = e;
        $.ajax('http://en.wikipedia.org/w/api.php', {
            'data': {
                'action': 'query',
                'prop': 'extracts',
                'format': 'json',
                'exintro': true,
                'titles': e.data.location,
                'callback': 'returnMessage'
            },
            'dataType': 'jsonp'
        });
    }
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
    window.addEventListener('message', getWikiExtract);
};