//Food Namespace
var entertainment = {};
entertainment.currentLocation;

entertainment.UPDATE_INTERVAL = 10000;

entertainment.initialize = function() {
    entertainment.v.find('.detail').append(places.createContentDiv());
};

entertainment.setLocation = function(location) {
    var types = [
        'amusement_park',
        'aquarium',
        'art_gallery',
        'book_store',
        'bowling_alley',
        'casino',
        'gym',
        'library',
        'movie_theater',
        'museum',
        'night_club',
        'park',
        'spa',
        'stadium',
        'zoo'
    ];
    var results = places.getNearbySearch('entertainment', location, types);
    
    results.onfinish = function() {
        entertainment.startHighlightUpdates(results);
    };
};

entertainment.startHighlightUpdates = function(results) {
    entertainment.stopHighlightUpdates();
    
    var update = new entertainment.UpdateService(results);
    update.start();
    entertainment.currentUpdateService = update;
};
entertainment.stopHighlightUpdates = function() {
    if (entertainment.currentUpdateService) {
        entertainment.currentUpdateService.stop();
    }
};
entertainment.UpdateService = function(results) {
    var self = this;
    
    this.results = results;
    this.index = 0;
    this.running = true;
    
    this.start = function() {
        if (self.running) {
            entertainment.wv.each(function() {
                var divs = self.results.getContentDivs(self.index, 3);
                var previous = divs[0].addClass('previous').click(self.highlightClickHandler);
                var current = divs[1].addClass('current').click(self.highlightClickHandler);
                var next = divs[2].addClass('next').click(self.highlightClickHandler);

                $(this).find('.highlights .highlight.previous').replaceWith(previous);
                $(this).find('.highlights .highlight.current').replaceWith(current);
                $(this).find('.highlights .highlight.next').replaceWith(next);
            });
            self.index++;
            
            setTimeout(self.start, entertainment.UPDATE_INTERVAL);
        }
    };
    this.stop = function() {
        self.running = false;
    };
    
    this.highlightClickHandler = function(e) {
        var index = $(e.target).closest('.highlight').attr('data-index');
        var div = self.results.getDetailDiv(index);
        entertainment.wv.find('.detail').replaceWith(div);
    };
};