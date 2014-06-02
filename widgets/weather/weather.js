//Weather Namespace
var weather = {};

weather.UPDATE_INTERVAL = 60000 * 5;

weather.initialize = function() {
    setInterval(weather.update, weather.UPDATE_INTERVAL);
};

weather.setLocation = function(location) {
    var url = [];
    url.push('http://api.openweathermap.org/data/2.5/weather?units=imperial');
    url.push('&q=');
    url.push(location.city);
    url.push(',');
    url.push(location.country);

    $.get(url.join('')).success(function(data) {
        weather.setWeather(data);
    });
};
weather.update = function() {
    weather.setLocation(live.location);
};

weather.setWeather = function(data) {
    if (parseInt(data.cod) === 200) {
        weather.wv.find('.city').html(data.name);
        weather.wv.find('.country').html(data.sys.country);

        if (data.weather.length > 0) {
            weather.wv.find('.weather-icon').attr('src', weather.getIconUrl(data.weather[0].icon));
            weather.wv.find('.climate').html(data.weather[0].description);
        }
        weather.wv.find('.temperature .digits').html(data.main.temp);
    }
    else {
        weather.wv.find('.climate').html(data.message);
    }
};

weather.getIconUrl = function(code) {
    return 'widgets/weather/icons/' + code + '.png';
};