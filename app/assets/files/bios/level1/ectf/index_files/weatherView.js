define(['module/bootstrap'], function(news) {

    var WeatherView = function(selectorContainer) {
        this.container       = news.$(selectorContainer);
        if(!this.container.length) return;

        this.weatherLinkHref = this.container.attr('href');

        // clear weather link
        this.hideWeather();

        // set up event listeners (with correct scope)
        news.pubsub.on('weather:success', this.handleSuccess, this);
        news.pubsub.on('weather:requestError', this.handleError, this);
    };
    WeatherView.prototype = {
        setContent: function(content, location) {
            content = this.setLocationName(content, location.name);
            this.container.html(content);
        },
        setLink: function(locationId) {
            locationId = (locationId) ? locationId.toLowerCase() : '';
            this.container.attr('href', this.weatherLinkHref + locationId);
        },
        setLocationName: function(content, locationName) {
            return content.replace('{{locationName}}', locationName);
        },
        handleSuccess: function(response, location) {
            this.setContent(response, location);
            this.setLink(location.id);

            this.showWeather();
        },
        handleError: function() {
            this.hideWeather();
        },
        showWeather: function() {
            this.container.removeClass('hidden');
        },
        hideWeather: function() {
            this.container.addClass('hidden');
        }
    };

    return WeatherView;
});
