/*global define */
/*jslint undef: false */
define(["vendor/istats/istats"], function (istats) {

    var Stats, logEvent, ee, response;

    /**
     * Log a event with iStats
     *
     * @return void
     */
    logEvent = function(actionType, labels) {
        if (typeof labels === "undefined") {
            labels = false;
        }
        istats.log(actionType, 'locator', labels);
    };

    /**
     * Stats class
     *
     * @param {Object} pubsub an instance of EventEmitter that will have further
     *                        events attached to it
     * @param {Object} logger an optional parameter for injecting the log function
     * @constructor
     */
    Stats = function(pubsub, logger) {
        // keep the event emitter private to this module
        ee = pubsub;

        // inject the logger by passing it as a second parameter
        if (typeof logger === "function") {
            logEvent = logger;
        }
    };

    /**
     * Apply event callbacks to log stats
     *
     * @return void
     */
    Stats.prototype.applyEvents = function() {

        // log browser support for html5 geolocation
        ee.on('locator:open', function(){
            logEvent('open', {
                supports_geolocation: (typeof navigator.geolocation !== "undefined") ? 1 : 0
            });
        });

        // user has opted to change their location
        ee.on('locator:changeLocationPrompt', function(){
            logEvent('open');
        });

        // when user confirms location using HTML5 geolocation api
        ee.on('locator:geoLocation', function(position){
            logEvent('geo_location', {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            });
        });

        // user has submitted search query and results are returned
        ee.on('locator:searchResults', function(r){
            var labels;

            if (typeof r.offset === "undefined") {
                r.offset = 0;
            }

            if (typeof r.limit === "undefined") {
                r.limit = 10;
            }

            labels = {
                ns_search_term: r.searchTerm,
                offset: r.offset,
                page_num: (r.offset + r.limit) / r.limit
            };

            if (labels.page_num > 1) {
                logEvent('more_results', labels);
            } else {
                logEvent('search', labels);
            }
        });

        // user has submitted an auto complete search request
        ee.on('locator:submitAutoCompleteSearch', function(searchTerm){
            var labels;
            labels = {
                ns_search_term: searchTerm
            };
            logEvent('autocomplete_search', labels);
        });

        // user has clicked on an auto complete result
        ee.on('locator:submitAutoCompleteLocation', function(locationId, locationName){
            var labels;
            labels = {
                location_id : locationId,
                location_name : locationName
            };
            logEvent('autocomplete_click', labels);
        });

        // when an application error occurs
        ee.on('locator:error', function(){
            logEvent('http_error');
        });

        // when the location has changed
        ee.on('locator:locationChanged', function(location){
            var labels;

            // when geolocation fails, location is null
            if (location === null) {
                return;
            }

            labels = {
                location_id: location.id,
                location_name: location.name
            };
            if (location.local_region) {
                labels.news_region = location.local_region;
            }
            logEvent('confirm', labels);
        });

        // when the search results land between more than one news regions
        ee.on('locator:newsLocalRegions', function(response){
            var labels, _ref, regions;
            labels = {
                location_id: response.location.id,
                location_name: response.location.name
            };

            regions = [];
            for (_ref in response.regions) {
                if (response.regions.hasOwnProperty(_ref)) {
                    regions.push(response.regions[_ref].name);
                }
            }

            labels.location_regions = regions.join(', ');
            logEvent('news_local_regions', labels);
        });
    };

    return Stats;

});