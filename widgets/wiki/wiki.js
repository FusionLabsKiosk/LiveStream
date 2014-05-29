//Wiki Namespace
var wiki = {};

wiki.initialize = function() {
    wiki.updateWiki();
    
    window.addEventListener('message', function(e) {
        if (e.data.widget === 'wiki') {
            wiki.setExtract(e.data);
        }
    });
};
wiki.start = function() {
    wiki.updateWiki();
};

wiki.updateWiki = function() {
    setTimeout(function() {
        var win = wiki.wv.find('#sandbox').get(0).contentWindow;
        if (win !== null) {
            win.postMessage({
                'widget': 'wiki',
                'location': live.location
            }, '*');
        }
    }, 1000);
};

wiki.setExtract = function(data) {
    wiki.wv.find('.city').html(data.title);
    wiki.wv.find('.long-description').html(data.extract);
    wiki.wv.find('.short-description').html(data.extract.split('\n')[0]);
};