define([
    'module/bootstrap',
    'vendor/ender/reqwest'
], function(
    news,
    reqwest
) {

    var Weather = function(opts) {
        this.options = opts || {};
        this.options.type = this.options.type || "hourly";
        this.options.append_ext = this.options.append_ext || undefined;

        news.pubsub.addListener('locator:locationChanged', this.updateWeather, this);
    };

    Weather.prototype.updateWeather = function(location) {
        if (location && location.id) {
            news.pubsub.emit('weather:requestStarted');
            var url = news.config.pathPrefix + "/weather/" + location.id.toLowerCase() + "/" + this.options.type;

            reqwest({
                url: url + ((this.options.append_ext !== undefined) ? this.options.append_ext : ''),
                method: "get",
                type: "html",
                success: function(response) {
                    news.pubsub.emit('weather:success', [response, location]);
                },
                error: function(error) {
                    news.pubsub.emit('weather:requestError', [error]);
                }
            });
        }
    };

    return Weather;
});
