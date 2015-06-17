define([
    'jquery',
    'underscore',
    'backbone',
    'handlebars',
    'hb!../templates/page-template.html',
    'hb!../templates/music-template.html',
    'hb!../templates/partials/sound.html',
    'templates/helpers/if_mod',
    'soundcloud_widget',
    'soundcloud_sdk',
], function($, _, Backbone, Handlebars, PageTemplate, MusicTemplate, SoundPartial, if_mod, SCWidget){
        var View = Backbone.View.extend({
            el: $('#wrapper'),
            html: false,
            template: function() {
                var a = new $.Deferred();
                SC.initialize({
                    client_id: '4790864defb6a0d7eb3017d49a31b273'
                });
                var title = 'Music';
                var $this = this;
                var html = SC.get('/users/rickyrombo/tracks', {limit: 200} , function(tracks){
                    var sounds = [];
                    tracks.forEach(function(sound){
                        if (sound.artwork_url){
                            sound.artwork_url = sound.artwork_url.replace(/large/, 't500x500');
                        }
                        sounds.push(sound);
                    });

                    var musicHtml = MusicTemplate(
                        {
                            recent_sounds: sounds.splice(0,4),
                            other_sounds: sounds
                        },
                        {
                            partials: {
                                sound: SoundPartial
                            },
                            helpers: {
                                if_mod: if_mod,
                            }
                        });
                    var html = PageTemplate(
                        {
                            title: title,
                            tagline: ['<a title="Find me on Soundcloud" href="http://soundcloud.com/rickyrombo">Find me on Soundcloud</a>',
                            '<a href="https://www.facebook.com/therickyrombo/app_208195102528120" title="Free downloads">Looking for free downloads?</a>'],
                            main: musicHtml
                        });
                    var persistingTitle = $('title').text().split('|')[1];
                    $('title').text(title + ' |' +  persistingTitle);
                    $this.html = html;
                    a.resolve();
                });
                return a;
            },
            registerClickEvents: function() {
                $('a.sound-link').click(function(e){
                    if (e.ctrlKey) {
                        return;
                    }
                    var href = $(this).attr('href');
                    e.preventDefault();
                    SCWidget.load(href, { auto_play: true });
                });
            },
            render: function() {
                if (!this.html){
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
        return View;
    }
);
