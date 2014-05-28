//Timezone Namespace
var timezone = {};

//Global Variables
timezone.API_KEY = 'AIzaSyCEc-ILEMoraGX8sL0pMdgtfqSq2kOkleo';

//Timezone Locations
timezone.DALLAS = ['32.77', '-96.79', '.dallas', 'Dallas'];
timezone.LA = ['34.05', '-118.25', '.la', 'Los Angeles'];
timezone.LONDON = ['51.50', '0.12', '.london', 'London'];

timezone.initialize = function() {
    timezone.w = live.widgets.timezone.widget;
    timezone.v = live.widgets.timezone.view;
    timezone.wv = timezone.w.add(timezone.v);
    
    timezone.w.append(timezone.createTimezoneDiv().addClass('dallas'));
    
    timezone.v.append(timezone.createTimezoneDiv().addClass('dallas'));
    timezone.v.append(timezone.createTimezoneDiv().addClass('la'));
    timezone.v.append(timezone.createTimezoneDiv().addClass('london'));
    
    timezone.getOffset(timezone.DALLAS);
    timezone.getOffset(timezone.LA);
    timezone.getOffset(timezone.LONDON);
    
    timezone.updateClocks();
};

timezone.start = function() {
    
};

timezone.end = function() {
    
};

timezone.createTimezoneDiv = function() {
    return $('<div/>').addClass('clock')
            .append($('<span/>').addClass('name'))
            .append($('<span/>').addClass('city'))
            .append($('<span/>').addClass('hour'))
            .append($('<span/>').addClass('separator').html(':'))
            .append($('<span/>').addClass('minute'))
            .append($('<span/>').addClass('separator').html(':'))
            .append($('<span/>').addClass('second'))
            .append($('<span/>').addClass('am-pm'));
};

timezone.getOffset = function(location) {
    var request = [];
    request.push('https://maps.googleapis.com/maps/api/timezone/json');
    request.push('?location=');
    request.push(location[0]);
    request.push(',');
    request.push(location[1]);
    $.ajax(request.join(''), {
        data: {
            'timestamp': new Date().getTime() / 1000,
            'sensor': false,
            'key': timezone.API_KEY
        }
    }).success(function(data) {
        var clock = timezone.wv.find(location[2]);
        clock.attr('rawOffset', data.rawOffset);
        clock.attr('dstOffset', data.dstOffset);
        clock.find('.name').html(data.timeZoneName);
        clock.find('.city').html(location[3]);
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
    });
    
    setTimeout(timezone.updateClocks, 500);
};