//Food Namespace
var finance = {};
finance.currentLocation;

finance.UPDATE_INTERVAL = 10000;

finance.initialize = function() {
    finance.v.find('.detail').append(places.createContentDiv());
};

finance.setLocation = function(location) {
    var types = [
        'atm',
        'bank',
        'finance'
    ];
    var results = places.getNearbySearch('finance', location, types);
    
    results.onfinish = function() {
        finance.startHighlightUpdates(results);
    };
};

finance.startHighlightUpdates = function(results) {
    finance.stopHighlightUpdates();
    
    var update = new finance.UpdateService(results);
    update.start();
    finance.currentUpdateService = update;
};
finance.stopHighlightUpdates = function() {
    if (finance.currentUpdateService) {
        finance.currentUpdateService.stop();
    }
};
finance.UpdateService = function(results) {
    var self = this;
    
    this.results = results;
    this.index = 0;
    this.running = true;
    
    this.start = function() {
        if (self.running) {
            finance.wv.each(function() {
                var divs = self.results.getContentDivs(self.index, 3);
                var previous = divs[0].addClass('previous').click(self.highlightClickHandler);
                var current = divs[1].addClass('current').click(self.highlightClickHandler);
                var next = divs[2].addClass('next').click(self.highlightClickHandler);

                $(this).find('.highlights .highlight.previous').replaceWith(previous);
                $(this).find('.highlights .highlight.current').replaceWith(current);
                $(this).find('.highlights .highlight.next').replaceWith(next);
            });
            self.index++;
            
            setTimeout(self.start, finance.UPDATE_INTERVAL);
        }
    };
    this.stop = function() {
        self.running = false;
    };
    
    this.highlightClickHandler = function(e) {
        var index = $(e.target).closest('.highlight').attr('data-index');
        var div = self.results.getDetailDiv(index);
        finance.wv.find('.detail').replaceWith(div);
    };
};