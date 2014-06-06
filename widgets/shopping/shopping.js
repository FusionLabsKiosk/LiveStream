//Food Namespace
var shopping = {};
shopping.currentLocation;

shopping.UPDATE_INTERVAL = 10000;

shopping.initialize = function() {
    shopping.v.find('.detail').append(places.createContentDiv());
};

shopping.setLocation = function(location) {
    var types = [
        'book_store',
        'clothing_store',
        'department_store',
        'electronics_store',
        'florist',
        'furniture_store',
        'grocery_or_supermarket',
        'hair_care',
        'hardware_store',
        'health',
        'home_goods_store',
        'jewelry_store',
        'liquor_store',
        'pet_store',
        'pharmacy',
        'shoe_store',
        'shopping_mall',
        'store'
    ];
    var results = places.getNearbySearch('shopping', location, types);
    
    results.onfinish = function() {
        shopping.startHighlightUpdates(results);
    };
};

shopping.startHighlightUpdates = function(results) {
    shopping.stopHighlightUpdates();
    
    var update = new shopping.UpdateService(results);
    update.start();
    shopping.currentUpdateService = update;
};
shopping.stopHighlightUpdates = function() {
    if (shopping.currentUpdateService) {
        shopping.currentUpdateService.stop();
    }
};
shopping.UpdateService = function(results) {
    var self = this;
    
    this.results = results;
    this.index = 0;
    this.running = true;
    
    this.start = function() {
        if (self.running) {
            shopping.wv.each(function() {
                var divs = self.results.getContentDivs(self.index, 3);
                var previous = divs[0].addClass('previous').click(self.highlightClickHandler);
                var current = divs[1].addClass('current').click(self.highlightClickHandler);
                var next = divs[2].addClass('next').click(self.highlightClickHandler);

                $(this).find('.highlights .highlight.previous').replaceWith(previous);
                $(this).find('.highlights .highlight.current').replaceWith(current);
                $(this).find('.highlights .highlight.next').replaceWith(next);
            });
            self.index++;
            
            setTimeout(self.start, shopping.UPDATE_INTERVAL);
        }
    };
    this.stop = function() {
        self.running = false;
    };
    
    this.highlightClickHandler = function(e) {
        var index = $(e.target).closest('.highlight').attr('data-index');
        var div = self.results.getDetailDiv(index);
        shopping.wv.find('.detail').replaceWith(div);
    };
};