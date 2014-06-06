//Food Namespace
var dining = {};
dining.currentLocation;

dining.UPDATE_INTERVAL = 10000;

dining.initialize = function() {
    dining.v.find('.detail').append(places.createContentDiv());
};

dining.setLocation = function(location) {
    var types = ['restaurant'];
    var results = places.getNearbySearch('dining', location, types);
    
    results.onfinish = function() {
        dining.startHighlightUpdates(results);
    };
};

dining.startHighlightUpdates = function(results) {
    dining.stopHighlightUpdates();
    
    var update = new dining.UpdateService(results);
    update.start();
    dining.currentUpdateService = update;
};
dining.stopHighlightUpdates = function() {
    if (dining.currentUpdateService) {
        dining.currentUpdateService.stop();
    }
};
dining.UpdateService = function(results) {
    var self = this;
    
    this.results = results;
    this.index = 0;
    this.running = true;
    
    this.start = function() {
        if (self.running) {
            dining.wv.each(function() {
                var divs = self.results.getContentDivs(self.index, 3);
                var previous = divs[0].addClass('previous').click(self.highlightClickHandler);
                var current = divs[1].addClass('current').click(self.highlightClickHandler);
                var next = divs[2].addClass('next').click(self.highlightClickHandler);

                $(this).find('.highlights .highlight.previous').replaceWith(previous);
                $(this).find('.highlights .highlight.current').replaceWith(current);
                $(this).find('.highlights .highlight.next').replaceWith(next);
            });
            self.index++;
            
            setTimeout(self.start, dining.UPDATE_INTERVAL);
        }
    };
    this.stop = function() {
        self.running = false;
    };
    
    this.highlightClickHandler = function(e) {
        var index = $(e.target).closest('.highlight').attr('data-index');
        var div = self.results.getDetailDiv(index);
        dining.wv.find('.detail').replaceWith(div);
    };
};