define('app', ['jquery', 'underscore', 'backbone', 'router', 'album_art', 'nav'],
    function($, _, Backbone, Router) {
        var init = function() {
            var router = new Router();
            router.init();
        };
        return { init: init };
    }
)