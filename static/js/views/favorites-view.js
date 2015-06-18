define([
    'jquery',
    'underscore',
    'backbone',
    'hb!../templates/page-template.html',
    'hb!../templates/favorites-template.html',
    'hb!../templates/partials/sound.html',
    'templates/helpers/if_mod',
    'soundcloud_widget',
    'soundcloud_sdk',
], function($, _, Backbone, PageTemplate, FavoritesTemplate, SoundPartial, if_mod, SCWidget){
   var FavoritesView = Backbone.View.extend({
       el: $('#main'),
       html: false,
       template: function() {
           var a = $.Deferred();
           SC.initialize({
               client_id: '4790864defb6a0d7eb3017d49a31b273'
           });
           $this = this;
           var title = 'Favorites';
           SC.get('/users/rickyrombo/favorites', {limit: 48} , function(tracks){
               var sounds = [];
               tracks.forEach(function(sound){
                   if (sound.artwork_url){
                       sound.artwork_url = sound.artwork_url.replace(/large/, 't500x500');
                   }
                   sounds.push(sound);
               });
               var favoritesHtml = FavoritesTemplate({
                   sounds: sounds
               },{
                   helpers: {
                       if_mod: if_mod
                   },
                   partials: {
                       sound: SoundPartial
                   }
               })
               var html = PageTemplate({ main: favoritesHtml });
               var persistingTitle = $('title').text().split('|')[1];
               $('title').text(title + ' |' +  persistingTitle);
               $this.html = html;
               a.resolve();
           });
           return a;
      },
      registerClickEvents: function(){
          $('a.sound-link').click(function(e){
              if (e.ctrlKey) {
                  return;
              }
              e.preventDefault();
              var id = $(this).attr('data-id');
              var permalink_url = $(this).attr('href');
              e.preventDefault();
              SCWidget.load(permalink_url, { auto_play: true });
//              SCWidget.findSound(id).done(function(index){
//                  if(index === false) {
//                      SCWidget.widget.load('http://soundcloud.com/rickyrombo/favorites', { callback: function(){
//                          SCWidget.seekToSound({id: id, permalink_url: permalink_url}, -1);
//                      }});
//                  } else {
//                      SCWidget.widget.skip(index);
//                  }
//              });
          });
      },
      render: function(){
          if (this.html === false){
              var $this = this;
              this.template().done(function(){
                  $this.$el.html($this.html);
                  $this.registerClickEvents();
              });
          }
          else {
              this.$el.html(this.html);
              this.registerClickEvents();
          }
      }
   });
   return FavoritesView;
});
