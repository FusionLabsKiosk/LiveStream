//Food Namespace
var food = {};
food.currentLocation;
food.highlights = [];
food.highlightIndex = 0;
food.highlightsUpdating = false;

food.UPDATE_INTERVAL = 10000;

food.initialize = function() {
    window.addEventListener('message', function(e) {
        if (e.data.widget === 'food') {
            if (e.data.results !== undefined) {
                food.setCurrentHighlights(e.data);
            }
            else if (e.data.result !== undefined) {
                food.setDetail(e.data);
            }
        }
    });
    food.wv.find('.highlights').append(food.createHighlightDiv());
    food.v.find('.detail').append(food.createDetailDiv());
};

food.setLocation = function(location) {
    food.stopHighlightUpdates();
    food.requestNearbySearch(location);
};

food.requestNearbySearch = function(location, nextPageKey) {
    food.currentLocation = location;
    var options = {
        'types': ['restaurant']
    };
    if (nextPageKey) {
        options.pageKey = nextPageKey;
    }
    sandbox.message({
        'script': 'places',
        'widget': 'food',
        'location': location,
        'options': options
    });
};
food.requestDetails = function(reference) {
    sandbox.message({
        'script': 'places',
        'widget': 'food',
        'reference': reference
    });
};


/* Highlights */
food.setCurrentHighlights = function(data) {
    food.highlights = data.results;
    food.highlightIndex = 0;
    food.hasNextPage = data.hasNextPage;
    food.pageKey = data.pageKey;
    food.startHighlightUpdates();
};

food.createHighlightDiv = function() {
    var div = $('<div/>').addClass('highlight')
            .append($('<div/>').addClass('name'))
            .append($('<div/>').addClass('attributions'))
            .append($('<img/>').addClass('icon'))
            .append($('<div/>').addClass('price'))
            .append($('<div/>').addClass('rating'))
            .append($('<div/>').addClass('address'))
            .append($('<div/>').addClass('phone'))
            .append($('<div/>').addClass('website'))
            .append($('<img/>').addClass('photo'))
            .append($('<div/>').addClass('photoAttributions'))
            .append($('<div/>').addClass('reference'));
    div.click(function() {
        var reference = $(this).find('.reference').html();
        food.requestDetails(reference);
    });
    return div;
};

//TODO: Refine start/stop functions, multiple updates can be running if timed properly
food.startHighlightUpdates = function() {
    if (!food.highlightsUpdating) {
        food.highlightsUpdating = true;
        food.highlightUpdates();
    }
};
food.stopHighlightUpdates = function() {
    food.highlightsUpdating = false;
};
food.highlightUpdates = function() {
    if (food.highlightsUpdating) {
        if (food.highlightIndex < food.highlights.length) {
            food.updateHighlightDivs(food.highlights[food.highlightIndex]);
            food.highlightIndex++;
        }
        else if (food.hasNextPage) {
            food.requestNearbySearch(food.currentLocation, food.pageKey);
        }
        else {
            food.requestNearbySearch(live.location);
        }
        setTimeout(food.highlightUpdates, food.UPDATE_INTERVAL);
    }
};

food.updateHighlightDivs = function(data) {
    var highlights = food.wv.find('.highlight');
    
    highlights.find('.attributions').empty();
    var attributions = highlights.find('.attributions');
    for (var i = 0; i < data.html_attributions.length; i++) {
        $('<div/>').addClass('attribution').html(data.html_attributions[i]).appendTo(attributions);
    }
        
    highlights.find('.name').html(data.name);
    highlights.find('.icon').attr('src', '');
    food.getExternalImage(data.icon, function(src) {
        highlights.find('.icon').attr('src', src);
    });
    highlights.find('.photo').attr('src', '');
    highlights.find('.photoAttributions').empty();
    if (data.photos.length > 0) {
        food.getExternalImage(data.photos[0].url, function(src) {
            highlights.find('.photo').attr('src', src);
        });
        attributions = highlights.find('.photoAttributions');
        for (var i = 0; i < data.photos[0].html_attributions.length; i++) {
            $('<div/>').addClass('attribution').html(data.photos[0].html_attributions[i]).appendTo(attributions);
        }
    }
    highlights.find('.price').html('Price Level: ' + data.price_level);
    highlights.find('.rating').html('Rating: ' + data.rating);
    
    highlights.find('.address').empty();
    if (data.formatted_address !== undefined) {
        highlights.find('.address').html('Location: ' + data.formatted_address);
    }
    else if (data.vicinity !== undefined) {
        highlights.find('.address').html('Location: ' + data.vicinity);        
    }
    
    highlights.find('.phone').empty();
    if (data.formatted_phone_number !== undefined) {
        highlights.find('.phone').html('Phone: ' + data.formatted_phone_number);
    }
    highlights.find('.website').empty();
    if (data.website !== undefined) {
        highlights.find('.website').html('Website: ' + data.website);
    }
    
    highlights.find('.reference').html(data.reference);
};


/* Details */
food.setDetail = function(data) {
    food.updateDetailDiv(data.result);
};
food.createDetailDiv = function() {
    //TODO: Refine detail vs highlight div content
    return $('<div/>').addClass('detail')
            .append($('<div/>').addClass('name'))
            .append($('<div/>').addClass('attributions'))
            .append($('<img/>').addClass('icon'))
            .append($('<div/>').addClass('price'))
            .append($('<div/>').addClass('rating'))
            .append($('<div/>').addClass('address'))
            .append($('<div/>').addClass('phone'))
            .append($('<div/>').addClass('website'))
            .append($('<img/>').addClass('photo'))
            .append($('<div/>').addClass('photoAttributions'));
};
food.updateDetailDiv = function(data) {
    //TODO: Refine detail vs highlight div content
    var detail = food.wv.find('.detail');
    
    detail.find('.attributions').empty();
    var attributions = detail.find('.attributions');
    for (var i = 0; i < data.html_attributions.length; i++) {
        $('<div/>').addClass('attribution').html(data.html_attributions[i]).appendTo(attributions);
    }
        
    detail.find('.name').html(data.name);
    detail.find('.icon').attr('src', '');
    food.getExternalImage(data.icon, function(src) {
        detail.find('.icon').attr('src', src);
    });
    detail.find('.photo').attr('src', '');
    detail.find('.photoAttributions').empty();
    if (data.photos.length > 0) {
        food.getExternalImage(data.photos[0].url, function(src) {
            detail.find('.photo').attr('src', src);
        });
        attributions = detail.find('.photoAttributions');
        for (var i = 0; i < data.photos[0].html_attributions.length; i++) {
            $('<div/>').addClass('attribution').html(data.photos[0].html_attributions[i]).appendTo(attributions);
        }
    }
    detail.find('.price').html('Price Level: ' + data.price_level);
    detail.find('.rating').html('Rating: ' + data.rating);
    
    detail.find('.address').empty();
    if (data.formatted_address !== undefined) {
        detail.find('.address').html('Location: ' + data.formatted_address);
    }
    else if (data.vicinity !== undefined) {
        detail.find('.address').html('Location: ' + data.vicinity);        
    }
    
    detail.find('.phone').empty();
    if (data.formatted_phone_number !== undefined) {
        detail.find('.phone').html('Phone: ' + data.formatted_phone_number);
    }
    detail.find('.website').empty();
    if (data.website !== undefined) {
        detail.find('.website').html('Website: ' + data.website);
    }
};

food.getExternalImage = function(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'blob';
    xhr.onload = function() {
        callback(window.URL.createObjectURL(xhr.response));
    };
    xhr.open('GET', url, true);
    xhr.send();
};