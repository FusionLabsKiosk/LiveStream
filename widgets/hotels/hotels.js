//Food Namespace
var hotels = {};
hotels.currentLocation;

hotels.UPDATE_INTERVAL = 10000;

hotels.initialize = function() {
    hotels.v.find('.detail').append(places.createContentDiv());
};

hotels.setLocation = function(location) {
    var types = [
        'campground',
        'lodging',
        'rv_park'
    ];
    var results = places.getNearbySearch('hotels', location, types);
    
    results.onfinish = function() {
        hotels.startHighlightUpdates(results);
    };
};

hotels.startHighlightUpdates = function(results) {
    hotels.stopHighlightUpdates();
    
    var update = new hotels.UpdateService(results);
    update.start();
    hotels.currentUpdateService = update;
};
hotels.stopHighlightUpdates = function() {
    if (hotels.currentUpdateService) {
        hotels.currentUpdateService.stop();
    }
};
hotels.UpdateService = function(results) {
    var self = this;
    
    this.results = results;
    this.index = 0;
    this.running = true;
    
    this.start = function() {
        if (self.running) {
            hotels.wv.each(function() {
                var divs = self.results.getContentDivs(self.index, 3);
                var previous = divs[0].addClass('previous').click(self.highlightClickHandler);
                var current = divs[1].addClass('current').click(self.highlightClickHandler);
                var next = divs[2].addClass('next').click(self.highlightClickHandler);

                $(this).find('.highlights .highlight.previous').replaceWith(previous);
                $(this).find('.highlights .highlight.current').replaceWith(current);
                $(this).find('.highlights .highlight.next').replaceWith(next);
            });
            self.index++;
            
            setTimeout(self.start, hotels.UPDATE_INTERVAL);
        }
    };
    this.stop = function() {
        self.running = false;
    };
    
    this.highlightClickHandler = function(e) {
        var index = $(e.target).closest('.highlight').attr('data-index');
        var div = self.results.getDetailDiv(index);
        hotels.wv.find('.detail').replaceWith(div);
    };
};