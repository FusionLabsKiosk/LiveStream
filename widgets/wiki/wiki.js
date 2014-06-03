//Wiki Namespace
var wiki = {};

wiki.initialize = function() {
    window.addEventListener('message', function(e) {
        if (e.data.widget === 'wiki') {
            wiki.setExtract(e.data);
        }
    });
};
wiki.setLocation = function(location) {
    sandbox.message({
        'script': 'wiki',
        'widget': 'wiki',
        'location': location.city
    });
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