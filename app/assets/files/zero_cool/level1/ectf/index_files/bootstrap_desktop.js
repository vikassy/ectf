/*global define */
/*jslint undef: false */
// This gives us flexibility to change dependencies with a common API e.g. Bonzo --> jQuery
define(['vendor/events/eventEmitter', 'jquery-1'], function(placeholder, jquery){

    var pubsub = new EventEmitter();

    var bootstrap = {
        pubsub: pubsub,
        $: jquery,
        ajax: jquery.ajax
    };

    return bootstrap;
});
