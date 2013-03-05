/*jshint onecase:true */
define(['module/bootstrap', 'translator'], function (news, translator) {
    // time = time right now in milliseconds, i.e. Date().getTime()

    var timestamp = function(time) {
        this.time = time;
        this.insertTime();
    };

    timestamp.prototype.insertTime = function() {

        var dateElements = document.querySelectorAll('.date');

        for (var i = 0, len = dateElements.length; i < len; i++) {

            var element = dateElements[i];

            if (
                element.getAttribute('data-timestamp-inserted') !== undefined &&
                news.$('.live', element.parentElement).length === 0
            ) {

                var dataSeconds = element.getAttribute('data-seconds');

                if (typeof dataSeconds !== undefined) {

                    var difference = Math.abs(Math.ceil((this.time/1000) - parseInt(element.getAttribute('data-seconds'), 10))),
                        date = this.timeAgoInWords(difference);

                    if (date !== null) {
                        element.innerHTML = date;
                        element.className += ' relative-time';
                    } else {

                        if (element.innerHTML === '') {
                            var p = document.createElement('p');
                            p.innerHTML = element.getAttribute('data-datetime');
                            p.className = element.className;
                            element.parentNode.insertBefore(p, element);
                        }
                    }

                    element.setAttribute('data-timestamp-inserted', true);
                }
            }
        }
    };

    timestamp.prototype.russianRelativeTime = function(n, singular, genSingular, genPlural) {

        // Rules for russian relative times:
        //
        // singular:            1, 21, 31, ... 91, 101, 111... etc.
        // genitive singular:   2-4, 22-24, 32-34... etc.
        // genitive plural:     5-20, 25-30, 35-40... etc.

        var remainder = n % 10;
        if (remainder == 1 && (n == 1 || n > 20)) {
            return singular;
        } else if (remainder > 1 && remainder < 5 && (n > 20 || n < 10)) {
            return genSingular;
        } else {
            return genPlural;
        }
    };

    timestamp.prototype.minutesAgo = function(minutes) {
        switch (translator.getService()) {
            case 'russian':
                return this.russianRelativeTime(
                    minutes,
                    translator.get('singularMinutesAgo'),
                    translator.get('genSingularMinutesAgo'),
                    translator.get('genPluralMinutesAgo')
                ).replace('{x}', minutes);

            default:
                return minutes == 1 ? translator.get('oneMinuteAgo') : translator.get('xminutesAgo').replace('{x}', minutes);
        }
    };

    timestamp.prototype.hoursAgo = function(hours) {

        switch (translator.getService()) {
            case 'russian':
                return this.russianRelativeTime(
                    hours,
                    translator.get('singularHoursAgo'),
                    translator.get('genSingularHoursAgo'),
                    translator.get('genPluralHoursAgo')
                ).replace('{x}', hours);

            default:
                return hours == 1 ? translator.get('oneHourAgo') : translator.get('xhoursAgo').replace('{x}', hours);
        }
    };

    timestamp.prototype.timeAgoInWords = function(seconds) {
        var minutes = Math.floor(seconds / 60),
            hours = Math.floor(seconds / 3600);

        if (minutes < 1) {
            return translator.get('lessThanAMinuteAgo');
        } else if (hours < 1) {
            return this.minutesAgo(minutes);
        } else if (hours < 10) {
            return this.hoursAgo(hours);
        } else {
            return null;
        }
    };

    return timestamp;
});
