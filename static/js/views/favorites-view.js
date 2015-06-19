define([
    'jquery',
    'underscore',
    'backbone',
    'hb!../templates/page-template.html',
    'hb!../templates/sound-grid-template.html',
    'hb!../templates/partials/sound.html',
    'templates/helpers/if_mod',
    'soundcloud_widget',
    'soundcloud_sdk',
], function($, _, Backbone, PageTemplate, FavoritesTemplate, SoundPartial, if_mod, SCWidget){
   var FavoritesView = Backbone.View.extend({
       el: $('#main'),
       html: false,
       sounds: [],
       loads: 0,
       isLoadingSounds: false,
       template: function(partial) {
           var a = $.Deferred();
           SC.initialize({
               client_id: '4790864defb6a0d7eb3017d49a31b273'
           });
           var $this = this;
           var title = 'favorites';
           SC.get('/users/rickyrombo/favorites', {limit: 48, offset: this.loads++ * 48} , function(tracks){
               tracks.forEach(function(sound){
                   if (sound.artwork_url){
                       sound.artwork_url = sound.artwork_url.replace(/large/, 't500x500');
                   }
                   $this.sounds.push(sound);
               });
               var soundsToRender = $this.sounds.slice($this.sounds.length - tracks.length);
               if (soundsToRender.length === 0) {
                   a.reject();
               }
               var favoritesHtml = FavoritesTemplate({
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
          this.template(true).done(function(html){
              $(html).appendTo($this.el);
              $this.isLoadingSounds = false;
              $(window).trigger('soundsAdded', true);
              $this.registerClickEvents();
          }).fail(function(){
              $(window).trigger('soundsAdded',  false);
          });
      },
      render: function(){
          var $this = this;
          $(window).on('scroll', this.onscroll.bind($this));
          $(window).on('addMoreSounds', this.addMoreSounds.bind($this));
          if (this.html === false){
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
