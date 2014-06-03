//Weather Namespace
var weather = {};

weather.UPDATE_INTERVAL = 60000 * 5;

weather.initialize = function() {
    setInterval(weather.update, weather.UPDATE_INTERVAL);
};

weather.setLocation = function(location) {
    weather.getCurrentWeather(location);
    weather.getForecast(location);
};
weather.getCurrentWeather = function(location) {
    weather.showWidgetLoading();
    var url = 'http://api.openweathermap.org/data/2.5/weather';
    var param = {
        'q': location.city + ',' + location.country,
        'units': 'imperial'
    };
    $.ajax(url, {
        'data': param
    }).success(function(data) {
        weather.setCurrentWeather(data);
        weather.hideWidgetLoading();
    });
};
weather.getForecast = function(location) {
    weather.showViewLoading();
    var url = 'http://api.openweathermap.org/data/2.5/forecast/daily';
    var param = {
        'q': location.city + ',' + location.country,
        'units': 'imperial',
        'cnt': 7
    };
    $.ajax(url, {
        'data': param
    }).success(function(data) {
        weather.setForecast(data);
        weather.hideViewLoading();
    });
};

weather.update = function() {
    weather.setLocation(live.location);
};

weather.setCurrentWeather = function(data) {
    var current = weather.wv.find('.current-weather');
    current.empty();
    if (parseInt(data.cod) === 200) {
        var location = weather.createLocationDiv();
        location.find('.city').html(live.location.city);
        location.find('.state').html(live.location.state);
        location.find('.country').html(live.location.country);
        weather.wv.find('.location').empty().append(location);
        
        var day = weather.createWeatherDiv();
        var date = new Date(parseFloat(data.dt) * 1000);
        day.find('.date').html(date.toDateString());
        day.find('.temperature .temp').html(data.main.temp);
        day.find('.temperature .min').html(data.main.temp_min);
        day.find('.temperature .max').html(data.main.temp_max);
        day.find('.humidity').html(data.main.humidity);
        if (data.weather.length > 0) {
            day.find('.icon').attr('src', weather.getIconUrl(data.weather[0].icon));
            day.find('.message').html(data.weather[0].main);
        }
        current.append(day);
    }
    else {
        weather.wv.find('.error').html(data.message);
    }
};
weather.setForecast = function(data) {
    var forecast = weather.wv.find('.forecast');
    forecast.empty();
    if (parseInt(data.cod) === 200) {
        var location = weather.createLocationDiv();
        location.find('.city').html(live.location.city);
        location.find('.state').html(live.location.state);
        location.find('.country').html(live.location.country);
        weather.wv.find('.location').empty().append(location);
        
        for (var i = 0; i < data.list.length; i++) {
            var day = weather.createWeatherDiv();
            var date = new Date(parseFloat(data.list[i].dt) * 1000);
            day.find('.date').html(date.toDateString());
            day.find('.temperature .temp').html(data.list[i].temp.day);
            day.find('.temperature .min').html(data.list[i].temp.min);
            day.find('.temperature .max').html(data.list[i].temp.max);
            day.find('.humidity').html(data.list[i].humidity);
            if (data.list[i].weather.length > 0) {
                day.find('.icon').attr('src', weather.getIconUrl(data.list[i].weather[0].icon));
                day.find('.message').html(data.list[i].weather[0].main);
            }
            forecast.append(day);
        }
    }
    else {
        weather.wv.find('.error').html(data.message);
    }
};

weather.createLocationDiv = function() {
    return $('<div/>').addClass('location')
            .append($('<div/>').addClass('city'))
            .append($('<div/>').addClass('state'))
            .append($('<div/>').addClass('country'));
};
weather.createWeatherDiv = function() {
    var div = $('<div/>').addClass('day');
    div.append($('<div/>').addClass('date'));
    var temp = $('<div/>').addClass('temperature')
            .append($('<div/>').addClass('temp'))
            .append($('<div/>').addClass('min'))
            .append($('<div/>').addClass('max'));
    div.append(temp);
    div.append($('<div/>').addClass('humidity'));
    div.append($('<img/>').addClass('icon'));
    div.append($('<div/>').addClass('message'));
    return div;
};

weather.getIconUrl = function(code) {
    return 'widgets/weather/icons/' + code + '.png';
};