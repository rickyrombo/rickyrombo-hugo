define([
    'jquery',
    'underscore',
    'backbone',
    'hb!../templates/page-template.html',
    'hb!../templates/followings-template.html',
    'hb!../templates/partials/user.html',
    'templates/helpers/if_mod',
    'soundcloud_widget',
    'soundcloud_sdk',
], function($, _, Backbone, PageTemplate, FollowingsTemplate, UserPartial, if_mod, SCWidget){
   var FavoritesView = Backbone.View.extend({
       el: $('#main'),
       html: false,
       template: function() {
           SC.initialize({
               client_id: '4790864defb6a0d7eb3017d49a31b273'
           });
           var a = $.Deferred();
           var $this = this;
           var title = 'Followings';
           SC.get('/users/rickyrombo/followings', {limit: 48} , function(raw_users){
               var users = [];
               raw_users.forEach(function(user){
                   if (user.avatar_url){
                       user.avatar_url = user.avatar_url.replace(/large/, 't500x500');
                   }
                   users.push(user);
               });
               var followingsHtml = FollowingsTemplate({
                   users: users
               },{
                   helpers: {
                       if_mod: if_mod
                   },
                   partials: {
                       user: UserPartial
                   }
               })
               var html = PageTemplate({ main: followingsHtml })
               var persistingTitle = $('title').text().split('|')[1];
               $('title').text(title + ' |' +  persistingTitle);
               $this.html = html;
               a.resolve();
           });
           return a;
       },
       registerClickEvents: function() {
            $('div.user a').click(function(e){
                if (e.ctrlKey) {
                    return;
                }
                e.preventDefault();
                SCWidget.load($(this).attr('href'), {auto_play: true});
            });
       },
       render: function() {
           if(this.html === false){
               var $this = this;
               this.template().done(function(){
                   $this.$el.html($this.html);
                   $this.registerClickEvents();
               });
           } else {
               this.$el.html(this.html);
               this.registerClickEvents();
           }
       }
   });
   return FavoritesView;
});
