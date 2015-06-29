define([
    'jquery',
    'underscore',
    'backbone',
    'hb!../templates/page-template.html',
    'hb!../templates/sound-grid-template.html',
    'hb!../templates/partials/sound.html',
    'templates/helpers/if_mod',
    'player',
    'soundcloud_sdk',
], function($, _, Backbone, PageTemplate, SoundGridTemplate, SoundPartial, if_mod, Player){
   var FavoritesView = Backbone.View.extend({
       el: $('#main'),
       html: false,
       sounds: [],
       loads: 0,
       isLoadingSounds: false,
       initialize: function(){
            $(window).on('scroll', this.onscroll.bind(this));
        },
       template: function(partial) {
           var a = $.Deferred();
           SC.initialize({
               client_id: '4790864defb6a0d7eb3017d49a31b273'
           });
           var $this = this;
           var title = 'favorites';
           var opts = {limit: 48, offset: this.loads++ * 48};
           var favoritesPath = '/users/rickyrombo/favorites';
           SC.get(favoritesPath, opts, function(tracks){
               tracks.forEach(function(sound){
                   if (sound.artwork_url){
                       sound.artwork_url = sound.artwork_url.replace(/large/, 't500x500');
                   } else {
                       sound.user.avatar_url = sound.user.avatar_url.replace(/large/, 't500x500');
                   }
                   sound.playing_from = JSON.stringify({
                       api_path: favoritesPath,
                       url: window.location.pathname,
                       opts: opts,
                       title: title
                   });
                   $this.sounds.push(sound);
               });
               var soundsToRender = $this.sounds.slice($this.sounds.length - tracks.length);
               if (soundsToRender.length === 0) {
                   a.reject();
               }
               var favoritesHtml = SoundGridTemplate({
                   sounds: soundsToRender
               },{
                   helpers: {
                       if_mod: if_mod
                   },
                   partials: {
                       sound: SoundPartial
                   }
               })
               if (partial){
                   a.resolve(favoritesHtml);
                   return a;
               }
               var html = PageTemplate({ main: favoritesHtml });
               var persistingTitle = $('title').text().split('|')[1];
               $('title').text(title + ' |' +  persistingTitle);
               $this.html = html;
               a.resolve();
           });
           return a;
      },
      onscroll: function(){
          var scrollPos = $(window).scrollTop();
          var threshold = $(document).height() - $(window).height() * 3;
          if(scrollPos >= threshold){
              this.addMoreSounds();
          }
      },
      addMoreSounds: function() {
          if(this.isLoadingSounds){
              return;
          }
          this.isLoadingSounds = true;
          var $this = this;
          return this.template(true).done(function(html){
              $(html).appendTo($this.el);
              $this.isLoadingSounds = false;
              Player.registerClickEvents();
          });
      },
      render: function(){
          var $this = this;
          if (this.html === false){
              this.template().done(function(){
                  $this.$el.html($this.html);
                  Player.registerClickEvents();
              });
          }
          else {
              this.$el.html(this.html);
              Player.registerClickEvents();
          }
      }
   });
   return FavoritesView;
});
