//Timezone Namespace
var timezone = {};

//Global Variables
timezone.API_KEY = 'AIzaSyCEc-ILEMoraGX8sL0pMdgtfqSq2kOkleo';

//Timezone Locations
timezone.VIEW_LOCATIONS = [
    'Dallas',
    'Los Angeles',
    'London'
];

timezone.initialize = function() {    
    for (var i = 0; i < timezone.VIEW_LOCATIONS.length; i++) {
        var address = timezone.VIEW_LOCATIONS[i];
        timezone.v.append(timezone.createTimezoneDiv(address));
        geocoding.geocode(address, function(location) {
            timezone.getOffset(location, timezone.getClockClass(address));
        });
    }
    
    timezone.updateClocks();
};

timezone.setLocation = function(location) {
    timezone.w.find('.clock').remove();
    timezone.w.append(timezone.createTimezoneDiv(location.city));
    timezone.getOffset(location, timezone.getClockClass(location.city));
};

timezone.createTimezoneDiv = function(address, addressClass) {
    if (typeof addressClass !== 'string') {
        addressClass = timezone.getClockClass(address);
    }
    var clock =  $('<div/>').addClass('clock').addClass(addressClass)
            .append(timezone.createClockFaceDiv());
    var plainText = $('<div/>').addClass('plain-text')
            .append($('<span/>').addClass('name'))
            .append($('<span/>').addClass('city'))
            .append($('<span/>').addClass('hour'))
            .append($('<span/>').addClass('separator').html(':'))
            .append($('<span/>').addClass('minute'))
            .append($('<span/>').addClass('separator').html(':'))
            .append($('<span/>').addClass('second'))
            .append($('<span/>').addClass('am-pm'));
    clock.append(plainText);
    return clock;
};
timezone.createClockFaceDiv = function() {
    var clock = $('<div/>').addClass('clock-face');
    for (var i = 0; i < 12; i++) {
        clock.append($('<div/>').addClass('hour-mark').css('transform', 'rotate(' + (i * 30) + 'deg)'));
    }
    for (var i = 0; i < 60; i++) {
        clock.append($('<div/>').addClass('min-mark').css('transform', 'rotate(' + (i * 6) + 'deg)'));
    }
    clock.append($('<div/>').addClass('arrow-hour'));
    clock.append($('<div/>').addClass('arrow-minute'));
    clock.append($('<div/>').addClass('arrow-second'));
    clock.append($('<div/>').addClass('arrow-dot'));
    
    return clock;
};
timezone.getClockClass = function(address) {
    if (typeof address === 'string') {
        return address.toLowerCase().replace(/\s+/g, '');
    }
    return '';
};

timezone.getOffset = function(location, locationClass) {
    var request = [];
    request.push('https://maps.googleapis.com/maps/api/timezone/json');
    request.push('?location=');
    request.push(location.lat);
    request.push(',');
    request.push(location.lng);
    $.ajax(request.join(''), {
        data: {
            'timestamp': new Date().getTime() / 1000,
            'sensor': false,
            'key': timezone.API_KEY
        }
    }).success(function(data) {
        var clock = timezone.wv.find('.' + locationClass);
        clock.attr('rawOffset', data.rawOffset);
        clock.attr('dstOffset', data.dstOffset);
        clock.find('.name').html(data.timeZoneName);
        clock.find('.city').html(location.city);
    });
};

timezone.updateClocks = function() {    
    var clocks = timezone.wv.find('.clock');
    clocks.each(function() {
        var utc = new Date();
        var offset = parseFloat($(this).attr('rawOffset')) * 1000;
        offset += parseFloat($(this).attr('dstOffset') * 1000);
        var now = new Date(utc.getTime() + offset);
        var h = now.getUTCHours();
        var m = now.getUTCMinutes();
        var s = now.getUTCSeconds();
        var amPm = h >= 12 ? ' pm' : ' am';
        h = h % 12;
        h = h ? h : 12;
        m = m < 10 ? '0' + m : m;
        s = s < 10 ? '0' + s : s;

        $(this).find('.hour').html(h);
        $(this).find('.minute').html(m);
        $(this).find('.second').html(s);
        $(this).find('.am-pm').html(amPm);
        
        h = Math.round((h % 12) * 30) + Math.floor(m / 2);
        m = Math.round(m * 6);
        s = Math.round(s * 6);
        
        $(this).find('.arrow-hour').css('transform', 'rotate(' + h + 'deg)');
        $(this).find('.arrow-minute').css('transform', 'rotate(' + m + 'deg)');
        $(this).find('.arrow-second').css('transform', 'rotate(' + s + 'deg)');
    });
    
    setTimeout(timezone.updateClocks, 500);
};