//Food Namespace
var travel = {};
travel.currentLocation;

travel.UPDATE_INTERVAL = 10000;

travel.initialize = function() {
    travel.v.find('.detail').append(places.createContentDiv());
};

travel.setLocation = function(location) {
    var types = [
        'bus_station',
        'car_rental',
        'gas_station',
        'parking',
        'subway_station',
        'taxi_stand',
        'train_station',
        'travel_agency'
    ];
    var results = places.getNearbySearch('travel', location, types);
    
    results.onfinish = function() {
        travel.startHighlightUpdates(results);
    };
};

travel.startHighlightUpdates = function(results) {
    travel.stopHighlightUpdates();
    
    var update = new travel.UpdateService(results);
    update.start();
    travel.currentUpdateService = update;
};
travel.stopHighlightUpdates = function() {
    if (travel.currentUpdateService) {
        travel.currentUpdateService.stop();
    }
};
travel.UpdateService = function(results) {
    var self = this;
    
    this.results = results;
    this.index = 0;
    this.running = true;
    
    this.start = function() {
        if (self.running) {
            travel.wv.each(function() {
                var divs = self.results.getContentDivs(self.index, 3);
                var previous = divs[0].addClass('previous').click(self.highlightClickHandler);
                var current = divs[1].addClass('current').click(self.highlightClickHandler);
                var next = divs[2].addClass('next').click(self.highlightClickHandler);

                $(this).find('.highlights .highlight.previous').replaceWith(previous);
                $(this).find('.highlights .highlight.current').replaceWith(current);
                $(this).find('.highlights .highlight.next').replaceWith(next);
            });
            self.index++;
            
            setTimeout(self.start, travel.UPDATE_INTERVAL);
        }
    };
    this.stop = function() {
        self.running = false;
    };
    
    this.highlightClickHandler = function(e) {
        var index = $(e.target).closest('.highlight').attr('data-index');
        var div = self.results.getDetailDiv(index);
        travel.wv.find('.detail').replaceWith(div);
    };
};