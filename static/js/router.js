define([
    'jquery',
    'underscore',
    'backbone',
    'app',
    'views/music-view',
    'views/favorites-view',
    'views/followings-view',
    'views/news-view',
    'views/about-view',
    'views/post-view',
], function($, _, Backbone, App, MusicView, FavoritesView, FollowingsView, NewsView, AboutView, PostView){
        var musicView = new MusicView();
        var favoritesView = new FavoritesView();
        var followingsView = new FollowingsView();
        var newsView = new NewsView();
        var aboutView = new AboutView();
        var AppRouter = Backbone.Router.extend({
            routes: {
                'music' : 'renderMusic',
                'favorites' : 'renderFavorites',
                'followings' : 'renderFollowings',
                'about' : 'renderAbout',
                'news' : 'renderNews',
                '' : 'renderNews',
                'blog/*action' : 'renderPost',
                '*action' : 'notFound'
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
            renderNews: function() {
                newsView.render();
            },
            renderAbout: function() {
                aboutView.render();
            },
            renderPost: function(postId) {
                new PostView().render(postId);
            },
            notFound: function(action) {
                console.log(action, ': 404 not found');
                //notFoundView.render();
            },
            init : function(){ Backbone.history.start({pushState: true, root: "/"}); }
        });
        return AppRouter;
    }
)