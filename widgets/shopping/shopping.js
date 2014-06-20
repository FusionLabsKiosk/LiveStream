//Shopping Namespace
var shopping = {};

/**
 * The location that the widget is currently set to.
 * @type live.location
 */
shopping.currentLocation;

/**
 * Time between rotating the widget slider.
 * @type number
 */
shopping.UPDATE_INTERVAL = 10000;

/**
 * Initializes the shopping widget
 * @returns {undefined}
 */
shopping.initialize = function() 
{
    shopping.v.find('.detail').append(places.createContentDiv());
};

/**
 * Resets the widget to display data based on a new location.
 * @param {location} location - The location object that defines the
 *      location for the widget to reference.
 * @returns {undefined}
 */
shopping.setLocation = function(location) 
{
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
    shopping.w.find('.highlights').empty();
    var results = places.getNearbySearch('shopping', location, types);
    
    results.onfinish = function() {
        shopping.startHighlightUpdates(results);
        shopping.w.trigger('placesLoaded');
    };
};

/**
 * Performs intialization operations when the view is opened.
 * @returns {undefined}
 */
shopping.viewStart = function()
{
    shopping.w.unbind('click');
};

/**
 * Performs closedown operations when the view is opened.
 * @returns {undefined}
 */
shopping.viewEnd = function()
{
    shopping.w.unbind('click').click(function(e)
    {
        shopping.toggleView(false);
    });
};

/**
 * Creates the update service and starts the widget highlight slider.
 * @param {PlaceResults} results - The placeResults from the PlacesAPI call.
 * @returns {undefined}
 */
shopping.startHighlightUpdates = function(results)
{
    shopping.stopHighlightUpdates();
    
    var update = new shopping.UpdateService(results);
    update.start();
    shopping.currentUpdateService = update;
};

/**
 * Stops the widget highlight slider.
 * @returns {undefined}
 */
shopping.stopHighlightUpdates = function()
{
    if (shopping.currentUpdateService) {
        shopping.currentUpdateService.stop();
    }
};

/**
 * An object that updates the widget with results from the placesResults 
 * @param {PlaceResults} results - The placeResults from the PlacesAPI call.
 * @returns {UpdateService}
 */
shopping.UpdateService = function(results) 
{
    //internal object namespace
    var self = this;
    
    /**
     * The placeResults from the PlacesAPI call.
     * @type PlaceResults
     */
    this.results = results;
    
    /**
     * The index of the result that is currently displayed on the widget.
     * @type number
     */
    this.index = 0;
    
    /**
     * Determines whether the widget updates.
     * @type boolean
     */
    this.running = true;
    
    /**
     * Adds the places to the view and starts the widget updates.
     * @returns {undefined}
     */
    this.start = function()
    {
        shopping.v.find('.places-list').empty();
        for(var i = 0; i < self.results.results.length; i++)
        {
            var div = self.results.getContentDiv(i);
            if(div != undefined)
            {
                div.click(function(e)
                {
                    var index = $(this).data('index');
                    var view = self.results.resultsDivs[index].viewDiv;
                    self.highlightClickHandler(e, view);
                });
            }
            shopping.v.find('.places-list').append(div);
        }
        self.update();
    };
    
    /**
     * Updates the widget.
     * @returns {undefined}
     */
    this.update = function()
    {
        if(self.running)
        {
            self.updateWidget(shopping.w);
            self.index++;
            if(self.index > self.results.results.length)
            {
                self.index = 0;
            }

            setTimeout(self.update, shopping.UPDATE_INTERVAL);
        }
    }
    
    /**
     * Stops the widget slider.
     * @returns {undefined}
     */
    this.stop = function()
    {
        self.running = false;
    };
    
    /**
     * Adds the places result element to the detail element.
     * @param {event} e - The click event data.
     * @param {jQuery element} view - The widget's view element from the resultsDiv object.
     * @returns {undefined}
     */
    this.highlightClickHandler = function(e, view)
    {
        if(view == undefined)
        {
            $(e.currentTarget).clone().appendTo(shopping.v.find('.detail').empty()).removeClass('highlight');
        }
        else
        {
            shopping.v.find('.detail .content').detach().appendTo(shopping.v.find('.places-list')).addClass('highlight');
            view.appendTo(shopping.v.find('.detail').empty()).removeClass('highlight');
        }
    };
    
    /**
     * Updates the widget's slider.
     * @param {jQuery element} widget - The widget's widget element from the resultsDiv object.
     * @returns {undefined}
     */
    this.updateWidget = function(widget)
    {
        var div = self.results.getContentDiv(self.index, 'w');
        var current = div.addClass('current').click(function(e)
        {
            var index = $(this).data('index');
            var view = self.results.resultsDivs[index].viewDiv;
            self.highlightClickHandler(e, view);
        });
        
        slider.navigateTo($('.slider', shopping.w), current, slider.Direction.RIGHT).on(slider.Event.AFTER_OPEN, function(){self.animateWidgetData(widget);});
    }
    
    /**
     * Animates the data that appears on the widget.
     * @param {jQuery element} widget - The widget's widget element.
     * @returns {undefined}
     */
    this.animateWidgetData = function(widget)
    {        
        var price = widget.find('.price');
        price.velocity({opacity:0, translateZ:0, translateY: '100%'}, {duration:0});
        price.velocity({opacity:1, translateZ:0, translateY: 0}, [ 500, 20 ]);
        
        var icon = widget.find('.icon');
        icon.velocity({translateZ: 0,scaleX: "0",scaleY: "0"}, {duration:0});
        icon.velocity({opacity: 1, translateZ: 0,scaleX: "1",scaleY: "1"}, [ 500, 20 ]);
        
        var starCount = 0;
        var starRating = widget.find('.rating');
        starRating.find('.star').each(function()
        {
            var position = $(this).outerWidth() * starCount;            
            $(this).velocity({opacity:0, translateZ:0, translateX: '-100%'}, {duration:0});
            $(this).velocity({opacity:1, translateZ:0, translateX: position}, {'easing':[ 250, 25 ], 'delay': (starCount * 150)});
            starCount++;
        });
    }
    
};