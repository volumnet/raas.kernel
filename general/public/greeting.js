jQuery(function($) {
    $.fn.extend({
        serverClock: function(config) {
            var initSettings = { 
                interval: 1000, 
                GOODMORNING: 'Good Morning', 
                GOODAFTERNOON: 'Good Afternoon',
                GOODEVENING: 'Good Evening', 
                GOODNIGHT: 'Good Night',
            }
            config = $.extend(initSettings, config);
            var dt = new Date();
            var rx = /^(\d{2})\.(\d{2})\.(\d{4}) (\d{2}):(\d{2}):(\d{2})$/i.exec($(this).text());
            dt.setDate(rx[1]);
            dt.setMonth(rx[2]);
            dt.setYear(rx[3]);
            dt.setHours(rx[4]);
            dt.setMinutes(rx[5]);
            dt.setSeconds(rx[6]);

            var tick = function() {
                dt.setTime(dt.getTime() + 1000);
                var d = dt.getDate().toString();
                if (d.length == 1) {
                    d = '0' + d;
                }
                var m = dt.getMonth().toString();
                if (m.length == 1) {
                    m = '0' + m;
                }
                var Y = dt.getFullYear().toString();
                var H = dt.getHours().toString();
                if (H.length == 1) {
                    H = '0' + H;
                }
                var i = dt.getMinutes().toString();
                if (i.length == 1) {
                    i = '0' + i;
                }
                var s = dt.getSeconds().toString();
                if (s.length == 1) {
                    s = '0' + s;
                }
                document.getElementById('lblTime').innerHTML = d + '.' + m + '.' + Y + ' ' + H + ':' + i + ':' + s;
                H = dt.getHours();
                if (config.greeting && $(config.greeting).length) {
                    if (H >= 16 && H <= 23) {
                        $(config.greeting).html(config.GOODEVENING);
                    } else if (H >= 0 && H <= 3) {
                        $(config.greeting).html(config.GOODNIGHT);
                    } else if (H >= 4 && H <= 11) {
                        $(config.greeting).html(config.GOODMORNING);
                    } else {
                        $(config.greeting).html(config.GOODAFTERNOON);
                    }
                }
            }
            window.setInterval(tick, config.interval);
        }
    });
});