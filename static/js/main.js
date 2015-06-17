require.config({
    paths: {
        jquery: 'lib/jquery',
        soundcloud_sdk: 'lib/soundcloud/soundcloud-sdk',
        soundcloud_api: 'lib/soundcloud/soundcloud-api',
        handlebars: 'lib/handlebars/handlebars.amd',
        hbs_handlebars: 'lib/handlebars/handlebars',
        text: 'lib/handlebars/text',
        hb: 'lib/handlebars/hb',
        bootstrap: 'lib/bootstrap.min',
        underscore: 'lib/underscore-min',
        backbone: 'lib/backbone-min',
        album_art: 'album-art',
    },
    shim: {
        'underscore' : {
            exports: '_'
        },
        'backbone' : {
            deps: ['jquery', 'underscore'],
            exports: 'Backbone'
        },
        'bootstrap' : {
            deps: ['jquery']
        },
    }
});
require(['app'], function(App){
    App.init();
});