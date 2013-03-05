/*global define */
/*jslint undef: false */
// This gives us flexibility to change dependencies with a common API e.g. Bonzo --> jQuery
define([
    'vendor/events/eventEmitter',
    'vendor/ender/bonzo',
    'jquery-1',
    'config'
], function(
    placeholder,
    bonzo,
    jquery,
    config
) {
    var pubsub = new EventEmitter();

    var bootstrap = {
        pubsub: pubsub,
        $: jquery,
        config: config
    };

    return bootstrap;
});
