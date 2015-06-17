define(['jquery', 'soundcloud_sdk'], function($) {
//var $ = require('lib/jquery');
//var SC = require('lib/soundcloud-sdk');
    /**
     * Adds the sound artworks to the montage
     * @param sounds the sounds to add artwork from
     */
        $.fn.addImages = function (sounds) {
            var $element = this;
            sounds.forEach(function(e, i){
                var img = $('<img/>');
                $(img).attr('src', e.artwork_url);
                $(img).attr('alt', e.title);
                $(img).error(function(ev){
                    $(img).attr('src', e.user.avatar_url);
                });
                var newElement = $('<a/>');
                $(newElement).attr('href', e.permalink_url).attr('target', '_blank').addClass('album-art');
                $(newElement).attr('data-title', e.title).attr('data-artist', e.user.username);
                $(newElement).attr('data-index', i);
                $(newElement).append(img);
                $element.append(newElement);
            })
            return $element;
        }

    //Start SoundCloud
    SC.initialize({
        client_id: '4790864defb6a0d7eb3017d49a31b273'
    });
    $(document).ready(function() {
        //load background art
        SC.get('/users/rickyrombo/favorites', {limit: 200}, function(sounds) {
            var $collage = $('<div/>').addClass('collage-container');
            for(var i = 0; i < 2; i++) {
                $collage.addImages(sounds);
            }
            $collage.appendTo('body');
        });
    })
})