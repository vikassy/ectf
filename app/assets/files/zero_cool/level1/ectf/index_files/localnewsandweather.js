// Before you change this file... if you're changing anything, you'll need to
// change the desktop site too... we use this file on the front page!
// also, the markup uses the same classes. Just check before you change anything.

try {
    define([
        'module/bootstrap',
        'locator/main',
        'module/local/local',
        'module/local/localView',
        'module/weather/weather',
        'module/weather/weatherView',
        'config',
        'translator'
    ], function(
        news,
        Locator,
        Local,
        LocalView,
        Weather,
        WeatherView,
        config,
        translator
    ) {

        // selectors
        var element = {
            LOCATOR: '.locator',
            WEATHER: '.module-weather',
            LOCAL:   '.story-list'
        };


        // localnewsandweather module
        var LocalNewsAndWeather = {
            init: function( moduleSelector ) {
                this.moduleElement = news.$(moduleSelector);
                // return if module element doesn't exist in dom
                if(!this.moduleElement.length) return;

                this.moduleInner = news.$('.inner', this.moduleElement);
                this.moduleTitle = news.$('.title', this.moduleInner);

                // instantiate objects
                this.locator = new Locator({
                    pubsub: news.pubsub,
                    enableReverseGeocode: (config.local && config.local.allowLocationLookup) ? config.local.allowLocationLookup : false,
                    enableAutoComplete: (config.local && config.local.allowAutoComplete) ? config.local.allowAutoComplete : false,
                    host: config.locatorHost
                });

                this.local = new Local({
                    simple: (config.local && config.local.simple) ? config.local.simple : false,
                    story_limit: (config.local && config.local.story_limit) ? config.local.story_limit : 2,
                    append_ext: (config.local && config.local.append_ext) ? config.local.append_ext : undefined
                });

                this.weather = new Weather({
                    type: (config.local && config.local.weather_type) ? config.local.weather_type : "hourly",
                    append_ext: (config.local && config.local.append_ext) ? config.local.append_ext : undefined
                });

                this.localView   = new LocalView(element.LOCAL, this.moduleElement);
                this.weatherView = new WeatherView(element.WEATHER);

                // render into dom
                this.renderLocator();
                this.renderLocal();
                this.renderWeather();

                // unhide
                this.show();
            },
            setTitle: function(title, link) {
                if(link) title = '<a href="{{link}}">{{title}}</a>'.replace('{{link}}', link).replace('{{title}}', title);
                this.moduleTitle.html(title);
            },
            renderLocator: function() {
                this.locator.open(element.LOCATOR);
                this.location = this.locator.getLocation();

                // render open form if location isn't set
                if(!this.location) {
                    this.setTitle(translator.get('localNewsAndWeather'));
                    news.pubsub.emit('locator:renderForm');
                }
            },
            renderLocal: function() {
                this.local.updateLocalNews(this.location);
            },
            renderWeather: function() {
                this.weather.updateWeather(this.location);
            },
            show: function() {
                this.moduleElement.removeClass('hidden');
            },
            hide: function() {
                this.moduleElement.addClass('hidden');
            }
        };

        return LocalNewsAndWeather;
    });
}
catch(e)
{}
