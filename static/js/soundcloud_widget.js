define(['jquery', 'soundcloud_api'], function($, SC_API){
    //TODO: Override this widget and make load pull all the sounds for continuous play
    var Widget = {
        widget: SC.Widget($('#widget')[0]),
        playlist: [],
        currentSound: '',
        nextPending: false,
        load: function(url, options) {
            this.generatePlaylist();
            options.callback = function() {
                $('#nowPlaying').text()
            };
            $(window).on('soundsAdded', function(soundsAdded){
                var i = Widget.playlist.length;
                if (soundsAdded){
                    Widget.generatePlaylist();
                    console.log('generating playlist');
                }
                if (Widget.nextPending){
                    console.log('going to next sound');
                    Widget.currentSound = Widget.playlist[i % Widget.playlist.length];
                    Widget.widget.load(Widget.currentSound, { auto_play: true });
                    Widget.nextPending = false;
                }
            });
            this.widget.load(url, options);
            this.currentSound = url;
        },
        generatePlaylist: function() {
            var playlist = [];
            $('.sound').each(function(){ playlist.push($(this).find('.sound-link')[0].href); });
            this.playlist = playlist;
        },
        next: function() {
            this.widget.next();
            for (var i = 0; i < Widget.playlist.length; i++) {
                if (Widget.playlist[i] === Widget.currentSound) {
                    if (i == Widget.playlist.length - 1) {
                        console.log('end of playlist');
                        Widget.nextPending = true;
                        $(window).trigger('addMoreSounds', i);
                    } else {
                        Widget.currentSound = Widget.playlist[(i+1) % Widget.playlist.length];
                        Widget.widget.load(Widget.currentSound, { auto_play: true });
                    }
                    break;
                }
            }
        },
        prev: function() {
            this.widget.prev();
            for (var i = 0; i < Widget.playlist.length; i++) {
                if (Widget.playlist[i] === Widget.currentSound) {
                    Widget.currentSound = Widget.playlist[(i-1) % Widget.playlist.length];
                    Widget.widget.load(Widget.currentSound, { auto_play: true });
                    break;
                }
            }
        }
    };
    Widget.widget.bind(SC.Widget.Events['FINISH'], function(){
        Widget.next();
    });
    Widget.widget.bind(SC.Widget.Events['PLAY'], function(){
        Widget.widget.getCurrentSound(function(sound){
            $('#nowPlaying a').attr('href', sound.permalink_url);
            $('#nowPlaying span').text(sound.title);
            $('#playToggle>.glyphicon').removeClass('glyphicon-play');
            $('#playToggle>.glyphicon').addClass('glyphicon-pause');
        });
    });
    Widget.widget.bind(SC.Widget.Events['PAUSE'], function(){
        Widget.widget.getCurrentSound(function(sound){
            $('#playToggle>.glyphicon').removeClass('glyphicon-pause');
            $('#playToggle>.glyphicon').addClass('glyphicon-play');
        });
    });
    $('#playToggle').click(function(e){
        Widget.widget.toggle();
    });
    $('#playNext').click(function(){
        Widget.next();
    });
    $('#playPrev').click(function(){
        Widget.prev();
    });
//    Widget.widget.bind(SC.Widget.Events['FINISH'], function(){
//        Widget.getCurrentSound(function(sound){
//            var $sound = $('#' + sound.id + '.sound');
//            var next = $sound.next('.sound');
//            if (next) {
//                $(next).find('a.sound-link').click();
//            }
//            var sounds = $('.sound').get();
//            for(var i = 0; i < sounds.length; i++) {
//                if (sounds[i].id == sound.id) {
//                    $(sounds[i + 1]).find('a.sound-link').click();
//                    break;
//                }
//            }
//        });
//    });
//        findSound: function(id, sounds) {
//            var a = $.Deferred();
//            console.log('searching');
//            if (sounds === undefined) {
//                this.widget.getSounds(function(sounds){
//                    console.log('sounds count = ', sounds.length, sounds);
//                    for (var i = 0; i < sounds.length; i++) {
//                        if (sounds[i].id == id){
//                            console.log('found sound at ', i);
//                            a.resolve(i);
//                            break;
//                        }
//                    }
//                    a.resolve(false);
//                })
//            } else {
//                for (var i = 0; i < sounds.length; i++) {
//                    if (sounds[i].id == id){
//                        console.log('found sound at ', i);
//                        a.resolve(i);
//                        break;
//                    }
//                }
//                a.resolve(false);
//            }
//
//            return a;
//        },
//        seekToSound: function(sound, skipped) {
//            var id = sound.id;
//            var count;
//            var $this = this;
//            this.widget.getSounds(function(sounds){
//                count = sounds.length;
//                console.log('seeking', id, skipped, count);
//                if (skipped > 300) {
//                    $this.widget.load(sound.permalink_url, {auto_play: true});
//                }
//                $this.findSound(id, sounds).done(function(index){
//                    if(index === false) {
//                        console.log('not found');
//                        $this.widget.skip(count-1);
//                        $this.widget.getCurrentSound(function(s){
//                           $this.widget.seekTo(s.duration - 1);
//                            setTimeout(function(){$this.seekToSound(sound, count);}, 100);
//                        });
//                    } else {
//                        console.log('tada', index);
//                        $this.widget.skip(index);
//                    }
//                });
//            });
//
//        }
//    }


    return Widget;
});
