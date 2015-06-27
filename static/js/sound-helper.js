define([
    'jquery',
    'soundcloud_sdk',
    'hb!templates/partials/sound.html'
], function($, SC, SoundTemplate){
    var populateSounds = function(){
        var d = new $.Deferred();
        var r = [];
        $('.populate-sound').each(function(){
            var soundMe = $(this);
            r.push(function(){
                var s = new $.Deferred();
                SC.get('/resolve.json?url=' + soundMe.attr('data-url'), function(sound){
                    if (sound.artwork_url){
                        sound.artwork_url = sound.artwork_url.replace(/large/, 't500x500');
                    } else if(sound.user && sound.user.avatar_url) {
                        sound.user.avatar_url = sound.user.avatar_url.replace(/large/, 't500x500');
                    }
                    sound.playing_from = JSON.stringify({
                        url: window.location.pathname,
                        title: 'post'
                    });
                    var html = SoundTemplate(sound)
                    soundMe.html(html);
                    s.resolve();
                });
                return s;
            }());
        });
        $.when.apply($, r).done(function(){
            d.resolve();
        });
        return d;
    };
    return {populateSounds: populateSounds};
});
