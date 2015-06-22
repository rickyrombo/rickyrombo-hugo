define('app', ['jquery', 'underscore', 'backbone', 'router', 'player', 'album_art', 'nav'],
    function($, _, Backbone, Router, Player) {
        var init = function() {
            var router = new Router();
            router.init();
        };
        return { init: init };
    }
)