define([
    'jquery',
    'underscore',
    'backbone',
    'handlebars',
    'hb!../templates/page-template.html',
    'hb!../templates/sound-grid-template.html',
    'hb!../templates/partials/sound.html',
    'templates/helpers/if_mod',
    'player',
    'soundcloud_sdk',
], function($, _, Backbone, Handlebars, PageTemplate, SoundGridTemplate, SoundPartial, if_mod, Player){
        var View = Backbone.View.extend({
            el: $('#main'),
            html: false,
            template: function() {
                var a = new $.Deferred();
                SC.initialize({
                    client_id: '4790864defb6a0d7eb3017d49a31b273'
                });
                var title = 'music';
                var $this = this;
                var musicPath = '/users/rickyrombo/tracks';
                var opts = {limit: 200};
                var html = SC.get(musicPath, opts, function(tracks){
                    var sounds = [];
                    tracks.forEach(function(sound){
                        if (sound.artwork_url){
                            sound.artwork_url = sound.artwork_url.replace(/large/, 't500x500');
                        }
                        sound.playing_from = JSON.stringify({
                            url: window.location.pathname,
                            opts: opts,
                            title: title
                        });
                        sounds.push(sound);
                    });

                    var musicHtml = SoundGridTemplate({
                            sounds: sounds
                        },{
                            partials: {
                                sound: SoundPartial
                            },
                            helpers: {
                                if_mod: if_mod,
                            }
                        });
                    var html = musicHtml;
                    var persistingTitle = $('title').text().split('|')[1];
                    $('title').text(title + ' |' +  persistingTitle);
                    $this.html = html;
                    a.resolve();
                });
                return a;
            },
            render: function() {
                if (!this.html){
                    var $this = this;
                    this.template().done(function(){
                        $this.$el.html($($this.html));
                        Player.registerClickEvents();
                    });
                } else {
                    this.$el.html(this.html);
                    Player.registerClickEvents();
                }
            }
        });
        return View;
    }
);
