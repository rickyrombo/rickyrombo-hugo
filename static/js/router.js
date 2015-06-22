define([
    'jquery',
    'underscore',
    'backbone',
    'player',
	'nav',
    'views/music-view',
    'views/favorites-view',
    'views/followings-view',
    'sound-helper'
], function($, _, Backbone, player, nav, MusicView, FavoritesView, FollowingsView, soundHelper){
        var AppRouter = Backbone.Router.extend({
            routes: {
                'music(/)' : 'renderMusic',
                'favorites(/)' : 'renderFavorites',
                'followings(/)' : 'renderFollowings',
                '*action' : 'renderPage'
            },
            renderMusic: function() {
                this.renderPage('music').done(function(){
                    new MusicView().render();
                });
            },
            renderFavorites: function() {
                this.renderPage('favorites').done(function(){
                    new FavoritesView().render();
                });
            },
            renderFollowings: function() {
                this.renderPage('followings').done(function(){
                    new FollowingsView().render();
                })
            },
            renderPage: function(action) {
                var a = $.Deferred();
				if (action === null) {
					action = '';
				}
                $.get('/' + action).done(function(contents) {
                    $('title').text(contents.match(/<title>(.*?)<\/title>/)[1]);
                    $('header').html($(contents).find('header').html());
					$('#main').html($(contents).find('#main').html());
					nav.refresh();
                    soundHelper.populateSounds().done(function(){
                        player.registerClickEvents();
                    });
                    a.resolve();
				}).fail(function() {
                    alert('Could not open ' + (action || 'homepage') + '. \nCheck your internet connection and try again');
                });
                return a;
            },
            init : function(){ Backbone.history.start({pushState: true, root: "/"}); }
        });
        return AppRouter;
    }
)