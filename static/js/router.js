define([
    'jquery',
    'underscore',
    'backbone',
    'app',
	'nav',
    'views/music-view',
    'views/favorites-view',
    'views/followings-view',
    'views/news-view',
    'views/about-view',
    'views/post-view',
], function($, _, Backbone, App, nav, MusicView, FavoritesView, FollowingsView, NewsView, AboutView, PostView){
        var musicView = new MusicView();
        var favoritesView = new FavoritesView();
        var followingsView = new FollowingsView();
        var newsView = new NewsView();
        var aboutView = new AboutView();
		console.log(nav);
        var AppRouter = Backbone.Router.extend({
            routes: {
                'music' : 'renderMusic',
                'favorites' : 'renderFavorites',
                'followings' : 'renderFollowings',
                '*action' : 'renderPage'
            },
            renderMusic: function() {
                musicView.render();
            },
            renderFavorites: function() {
                favoritesView.render();
            },
            renderFollowings: function() {
                followingsView.render();
            },
            renderPage: function(action) {
				if (action === null) {
					action = '';
				}
                $.get('/' + action).done(function(contents) {
					$('#wrapper').html($(contents).find('#content'));
					nav.refresh();
				});
            },
            init : function(){ Backbone.history.start({pushState: true, root: "/"}); }
        });
        return AppRouter;
    }
)