/*global define */
/*jslint undef: false, evil: true */

define([
    'locator/bootstrap',
    'locator/locatorView',
    'locator/stats'
    ], function(
        bootstrap,
        LocatorView,
        Stats
    ){

    var newsMap = {"3":"england/berkshire","4":"england/birmingham_and_black_country","7":"england/bristol","8":"england/cambridgeshire","11":"england/cornwall","12":"england/coventry_and_warwickshire","13":"england/cumbria","16":"england/derbyshire","17":"england/devon","18":"england/dorset","19":"scotland/edinburgh_east_and_fife","20":"england/essex","22":"scotland/glasgow_and_west","23":"england/gloucestershire","26":"world/europe/guernsey","27":"england/hampshire","28":"england/hereford_and_worcester","30":"scotland/highlands_and_islands","31":"england/humberside","32":"world/europe/isle_of_man","33":"world/europe/jersey","34":"england/kent","35":"england/lancashire","36":"england/leeds_and_west_yorkshire","37":"england/leicester","38":"england/lincolnshire","39":"england/merseyside","40":"england/london","41":"england/manchester","42":"wales/mid_wales","43":"england/norfolk","44":"england/northamptonshire","45":"scotland/north_east_orkney_and_shetland","46":"wales/north_east_wales","21":"northern_ireland","47":"wales/north_west_wales","49":"england/nottingham","50":"england/oxford","57":"england/south_yorkshire","51":"england/shropshire","52":"england/somerset","53":"wales/south_east_wales","55":"scotland/south_scotland","56":"wales/south_west_wales","58":"england/stoke_and_staffordshire","59":"england/suffolk","66":"england/surrey","60":"england/sussex","61":"scotland/tayside_and_central","62":"england/tees","1":"england/beds_bucks_and_herts","63":"england/tyne_and_wear","65":"england/wiltshire","48":"england/york_and_north_yorkshire"};


    /**
     * Make a XHR
     * 
     * @param {String}   url        The URL to request
     * @param {Function} success    Function to call on a successful response
     * @param {String}   actionType The request type eg search, location, geolocate
     * @param {Function} complete   A callback function when request is complete
     */
    function doRequest(url, success, actionType, complete) {
        if (typeof complete === "function") {
            complete = function() {};
        }
        bootstrap.ajax({
            url: url,
            crossOrigin: true,
            dataType: 'json',
            method: 'get',
            success: success,
            error: function(e) {
                var responseText = e && e.responseText ? e.responseText : '{}';
                try {
                    /* Response JSON is parsed in a similar manner to reqwest */
                    response = window.JSON ? window.JSON.parse(responseText) : eval('(' + responseText + ')');
                } catch (err) {
                    response = null;
                }
                bootstrap.pubsub.emit('locator:error', [response, actionType]);
            },
            complete: complete
        });
    }

    /**
     * Locator.
     *
     * @param {Object} options passing custom options e.g. assigning an
     *                         event emitter to `pubsub` will inject your own
     *                         pubsub object.
     * @constructor
     */
    var Locator = function(options){
        var that, view, autoCompleteView, state, stats;

        that = this;
        state = false;

        options = options || {};

        this.host = options.host || '';

        this.getLocation();

        if (options.pubsub) {
            bootstrap.pubsub = options.pubsub;
        }

        stats = new Stats(bootstrap.pubsub);
        stats.applyEvents();

        bootstrap.pubsub.on('locator:open', function(selector){
            if (!state) {
                state = true;
                view = new LocatorView(selector, {
                    enableReverseGeocode: options.enableReverseGeocode !== false,
                    enableAutoComplete: options.enableAutoComplete !== false
                });

                if (that.location) {
                    bootstrap.pubsub.emit('locator:renderChangePrompt');
                } else {
                    bootstrap.pubsub.emit('locator:renderForm');
                }
            }
        });

        bootstrap.pubsub.on('locator:close', function(selector){
            if (state) {
                state = false;
                view.close();
                view = null;
            }
        });

        bootstrap.pubsub.on('locator:geoLocation', function(position){
            that.geoLocate(position.coords.latitude, position.coords.longitude);
        });

        bootstrap.pubsub.on('locator:submitSearch', function(searchTerm, offset){
            that.search(searchTerm, offset);
        });

        bootstrap.pubsub.on('locator:submitLocation', function(locationId, newsRegionId){
            that.checkLocation(locationId, newsRegionId);
        });

        bootstrap.pubsub.on('locator:submitAutoCompleteSearch', function(searchTerm){
            that.autoComplete(searchTerm);
        });

        bootstrap.pubsub.on('locator:submitAutoCompleteLocation', function(locationId, locationName){
            that.checkLocation(locationId, null);
        });
    };

    /**
     * Open the locator widget by emitting the event and dom selector.
     *
     * @param {String} selector the dom selector
     * @return void
     */
    Locator.prototype.open = function(selector) {
        bootstrap.pubsub.emit('locator:open', [selector]);
    };

    /**
     * Close the locator widget by emitting the event
     *
     * @return void
     */
    Locator.prototype.close = function() {
        bootstrap.pubsub.emit('locator:close');
    };

    /**
     * Handles a location by emitting events and setting a cookie (if `cookie`
     * and `expires` properties exist.
     *
     * @param {Object} location a json object containing location information
     * @return void
     */
    Locator.prototype.handleLocation = function(location) {
        var cookieString;
        if (location.cookie && location.expires) {
            cookieString = "locserv=" +location.cookie
                +"; expires=" + (new Date(location.expires*1000)).toUTCString()
                +"; path=/; domain=.bbc.co.uk";
            this.setCookieString(cookieString);
            this.hasParsedCoookie = false;
        }

        bootstrap.pubsub.emit('locator:renderChangePrompt');
        bootstrap.pubsub.emit('locator:locationChanged', [this.getLocation()]);
    };

    /**
     * Check the location by making an AJAX request to the service passing a
     * locationId and optionally, a news region id.
     *
     * @param {Number} locationId   location id
     * @param {Number} newsRegionId the news region id
     * @return void
     */
    Locator.prototype.checkLocation = function(locationId, newsRegionId) {
        bootstrap.pubsub.emit('locator:renderWait');
        var that = this,
            url =  this.host +'/locator/news/responsive/location.json?id=' +locationId;
        if (newsRegionId) {
            url += '&newsRegion=' +newsRegionId;
        }
        doRequest(url, function(r){
            that.handleResponse(r);
        }, 'location');
    };

    /**
     * Emit different events based on response type.
     *
     * @param {Object} r the response object
     * @return void
     */
    Locator.prototype.handleResponse = function(r) {
        if ('search_results' === r.type) {
            bootstrap.pubsub.emit('locator:searchResults', [r]);
        } else if ('autocomplete_search_results' === r.type) {
            bootstrap.pubsub.emit('locator:autoCompleteSearchResults', [r]);
        } else if ('news_regions' === r.type) {
            bootstrap.pubsub.emit('locator:newsLocalRegions', [r]);
        } else if ('geolocation' === r.type) {
            if (!r.isWithinContext) {
                bootstrap.pubsub.emit('locator:locationOutOfContext', [r]);
            }
        } else if ('location' === r.type) {
            this.handleLocation(r);
        }
    };

    /**
     * Search for a location and return the news region, geoname id and cookie
     * info
     *
     * @param {String} searchTerm the search term
     * @param {Number} offset     an offset specified for the results
     */
    Locator.prototype.search = function(searchTerm, offset) {
        var url = this.host +'/locator/news/responsive/search.json?search=' +searchTerm,
            that = this;

        if (offset) {
            url += '&offset=' + offset;
        }

        bootstrap.pubsub.emit('locator:renderWait');

        doRequest(url, function(r){
            that.handleResponse(r);
        }, 'search');
    };

    /**
     * Search for a location and return the news region, geoname id and cookie
     * info
     *
     * @param {String} searchTerm the search term
     * @param {Number} offset     an offset specified for the results
     */
    Locator.prototype.autoComplete = function(searchTerm) {
        var url = this.host +'/locator/news/responsive/autocomplete.json?search=' +searchTerm,
            that = this;

        doRequest(url, function(r){
            that.handleResponse(r);
        }, 'autocomplete');
    };

    /**
     * Get a location through using latitude/longitude coordinates
     *
     * @param {String} latitude
     * @param {String} longitude
     */
    Locator.prototype.geoLocate = function(latitude, longitude) {

        var url = this.host +'/locator/news/responsive/geolocate.json?'
            + 'latitude=' +latitude
            + '&longitude=' +longitude,
            that = this;

        bootstrap.pubsub.emit('locator:renderWait');
        doRequest(url, function(r){
            that.handleResponse(r);
        }, 'geolocate');
    };

    /**
     * Get the current cookie string. This is primarily used for stubbing
     * during for test purposes.
     *
     * @return {String}
     */
    Locator.prototype.getCookieString = function() {
        return document.cookie;
    };

    /**
     * Set the current cookie string. This is primarily used for stubbing
     * during for test purposes.
     *
     * @return {String}
     */
    Locator.prototype.setCookieString = function(value) {
        document.cookie = value;
    };

    /**
     * Get the current users location by accessing the cookie.
     *
     * @return {Object}
     */
    Locator.prototype.getLocation = function() {
        var cookie, domains, location, news, getValues;
        if (this.hasParsedCoookie) {
            return this.location;
        }
        getValues = function(store) {
            var index, values, value , result = {};
            store = store.substr(3);
            values = store.split(':');
            for(index=0;index<values.length;index++) {
                value = values[index].split('=');
                value[1] = value[1].replace(/\+/g, '%20');
                result[value[0]] = decodeURIComponent(value[1]);
            }
            return result;
        };
        cookie = this.getCookieString().match('locserv=(.*?)(;|$)');
        if(!cookie){
            return null;
        }

        domains = cookie[1].substr(2).split('@');
        location = getValues(domains[0]);
        news = getValues(domains[3]);
        newsPath = newsMap[news.r];
        weather = getValues(domains[1]);

        this.location = {
            id: location.i,
            name: location.n,
            news: {
                id: news.r,
                path: newsPath
            },
            weather: {
              id: weather.i
            }
        };

        this.hasParsedCoookie = true;

        return this.location;
    };
    
    return Locator;
});
