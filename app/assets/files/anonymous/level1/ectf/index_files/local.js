define([
    'module/bootstrap',
    'vendor/ender/reqwest'
], function(
    news,
    reqwest
) {

    var Local = function(opts) {
        this.options = opts || {};
        this.options.simple = this.options.simple || false;
        this.options.story_limit = this.options.story_limit || 2;
        this.options.append_ext = this.options.append_ext || undefined;

        news.pubsub.on('locator:locationChanged', this.updateLocalNews, this);
    };

    Local.prototype.updateLocalNews = function(location) {
        if (location && location.news && location.news.id && location.news.path) {
            news.pubsub.emit('local:requestStarted');
            reqwest({
                url: news.config.pathPrefix + '/' + location.news.path + ((this.options.append_ext !== undefined) ? this.options.append_ext : '') + '?limit=' + this.options.story_limit + '&simple=' + this.options.simple,
                type: 'html',
                headers: {'X-Transclude': 1},
                method: 'get',
                success: function(response) {
                    news.pubsub.emit('local:newsReceived', [response, location.news.path]);
                },
                error: function(e) {
                    news.pubsub.emit('local:requestError');
                }
            });
        } else {
            news.pubsub.emit('local:locationInvalid');
        }
    };

    return Local;
});
