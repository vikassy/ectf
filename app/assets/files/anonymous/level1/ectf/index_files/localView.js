define([
    'module/bootstrap',
    'module/timestamp',
    'module/imageenhancer',
    'config',
    'translator'
], function(
    news,
    Timestamp,
    ImageEnhancer,
    config,
    translator
){

    var LocalView = function(selectorContainer, context) {
        this.container = news.$(selectorContainer, context);
        if(!this.container.length) return;

        this.moduleTitle = news.$('.title', context);
        this.hideLocal();

        // event listeners
        news.pubsub.on('local:requestStarted', this.handleLoading, this);
        news.pubsub.on('local:newsReceived', this.handleSuccess, this);
        news.pubsub.on('local:requestError', this.handleError, this);
    };
    LocalView.prototype = {
        handleLoading: function() {
            this.setContent(null, 'loading');
        },
        handleSuccess: function(response, path) {
            this.showLocal();
            this.setContent(response);

            if (path) {
                this.setTitle(path);
            }
        },
        handleError: function() {
            this.setContent(translator.get('localNewsCouldNotBeLoaded'), 'error');
        },
        setTitle: function(indexPath) {
            var localStoriesElement = news.$('#local-stories', this.container);
            
            if(localStoriesElement && localStoriesElement.attr('data-title')) {
                this.moduleTitle.html('<a href="/news/' + indexPath + '">' + localStoriesElement.attr('data-title') + '</a>');
            }
        },
        setContent: function(response, className) {
            if(className) {
                response = '<div class="' + className + '">' + (response || '') + '</div>';
            }
            this.container.html(response);
            imageEnhance = new ImageEnhancer();
            timestamp = new Timestamp(new Date(new Date().toUTCString()).getTime());
        },
        hideLocal: function() {
            this.container.addClass('hidden');
        },
        showLocal: function() {
            this.container.removeClass('hidden');
        }
    };

    return LocalView;
});
