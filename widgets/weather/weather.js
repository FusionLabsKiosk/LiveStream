//Weather Namespace
var weather = {};

weather.initialize = function() {
    weather.update();
    setInterval(weather.update, 60000 * 5);
};

weather.start = function() {
    weather.update();
};

weather.end = function() {
    weather.update();
};

weather.update = function() {
    var url = [];
    url.push('http://api.openweathermap.org/data/2.5/weather?units=imperial');
    url.push('&q=');
    url.push(live.location);

    $.get(url.join('')).success(function(data) {
        weather.setWeather(data);
    });
    
    /*var dataDump = $('.weather .data-dump');
    dataDump.append('Getting data...');
    var request = $.get('http://api.openweathermap.org/data/2.5/weather?q=Dallas,TX&units=imperial');
    request.done(OpenWeatherRequest_Success);
    request.fail(OpenWeatherRequest_Fail);*/
};

weather.setWeather = function(data) {
    if (parseInt(data.cod) === 200) {
        $('.weather .city').html(data.name);
        $('.weather .country').html(data.sys.country);

        if (data.weather.length > 0) {
            $('.weather .weather-icon').attr('src', weather.getIconUrl(data.weather[0].icon));
            $('.weather .climate').html(data.weather[0].description);
        }
        $('.weather .temperature .digits').html(data.main.temp);
    }
    else {
        $('.weather .climate').html(data.message);
    }
};

weather.getIconUrl = function(code) {
    return 'widgets/weather/icons/' + code + '.png';
};

function OpenWeatherRequest_Success(data)
{
    var dataDump = $('.weather .data-dump');
    dataDump.append(data.toString());
    console.log(data);
}
        
function OpenWeatherRequest_Fail(jqXHR, textStatus)
{
    var dataDump = $('.weather .data-dump');
    dataDump.append("Request failed: " + textStatus);
}