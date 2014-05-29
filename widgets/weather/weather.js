//Weather Namespace
var weather = {};

weather.initialize = function()
{
    //Any initialization here
    weather.update();
    setInterval(weather.update, 60000 * 5);
};

weather.start = function()
{
    //Widget start logic
    weather.update();
};

weather.end = function()
{
    //Widget ending logic
};

weather.update = function()
{
    var dataDump = $('.weather .data-dump');
    dataDump.append('Getting data...');
    var request = $.get('http://api.openweathermap.org/data/2.5/weather?q=Dallas,TX&units=imperial');
    request.done(OpenWeatherRequest_Success);
    request.fail(OpenWeatherRequest_Fail);
}

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