define([
    'jquery',
    'underscore',
    'backbone',
    'app',
	'nav',
    'views/music-view',
    'views/favorites-view',
    'views/followings-view',
], function($, _, Backbone, App, nav, MusicView, FavoritesView, FollowingsView){
        var musicView = new MusicView();
        var favoritesView = new FavoritesView();
        var followingsView = new FollowingsView();
        var AppRouter = Backbone.Router.extend({
            routes: {
                'music(/)' : 'renderMusic',
                'favorites(/)' : 'renderFavorites',
                'followings(/)' : 'renderFollowings',
                '*action' : 'renderPage'
            },
            renderMusic: function() {
                this.renderPage('music').done(function(){
                    musicView.render();
                });
            },
            renderFavorites: function() {
                this.renderPage('favorites').done(function(){
                    favoritesView.render();
                });
            },
            renderFollowings: function() {
                this.renderPage('followings').done(function(){
                    followingsView.render();
                })
            },
            renderPage: function(action) {
                var a = $.Deferred();
				if (action === null) {
					action = '';
				}
                $.get('/' + action).done(function(contents) {
                    $('header').html($(contents).find('header').html());
					$('#main').html($(contents).find('#main').html());
					nav.refresh();
                    a.resolve();
				});
                return a;
            },
            init : function(){ Backbone.history.start({pushState: true, root: "/"}); }
        });
        return AppRouter;
    }
)