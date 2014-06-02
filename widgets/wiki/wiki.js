//Wiki Namespace
var wiki = {};

wiki.initialize = function() {
    window.addEventListener('message', function(e) {
        if (e.data.widget === 'wiki') {
            if (e.data.loaded) {
                wiki.setLocation(live.location);
                wiki.loaded = true;
            }
            else {
                wiki.setExtract(e.data);
            }
        }
    });
    wiki.checkSandboxLoaded();
};
wiki.setLocation = function(location) {
    wiki.sendSandboxMessage({
        'widget': 'wiki',
        'location': location.city
    });
};

wiki.loaded = false;
wiki.checkSandboxLoaded = function() {
    if (!wiki.loaded) {
        wiki.sendSandboxMessage({
            'widget': 'wiki',
            'loadedRequest': true
        });
        setTimeout(wiki.checkSandboxLoaded, 100);
    }
};

wiki.sendSandboxMessage = function(message) {
    var win = wiki.wv.find('#sandbox').get(0).contentWindow;
    if (win !== null) {
        win.postMessage(message, '*');
    }
};

wiki.setExtract = function(data) {
    wiki.wv.find('.city').html(data.title);
    var extract = data.extract;
    //Remove most pronunciation guides
    extract = extract.replace(/\/ˈ(.)*?\//g, '');
    //Remove first parentheses
    extract = extract.replace(/\(.*?\)/g, '');
    wiki.v.find('.description').html(extract);
    wiki.w.find('.description').html(extract.split('\n')[0]);
};