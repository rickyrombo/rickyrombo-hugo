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
        },
        parseMilleseconds: function(ms) {
            var minutes = Math.floor(ms/1000/60);
            var seconds = Math.floor(ms/1000) % 60;
            return minutes + ':' + ('0' + seconds).slice(-2)
        }
    };
    Widget.widget.bind(SC.Widget.Events['FINISH'], function(){
        Widget.next();
    });
    Widget.widget.bind(SC.Widget.Events['PLAY'], function(){
        Widget.widget.getCurrentSound(function(sound){
            $('#soundTitle').attr('href', sound.permalink_url);
            $('#soundTitle').text(sound.title);
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
    Widget.widget.bind(SC.Widget.Events['PLAY_PROGRESS'], function(e){
        if ($('#curPos').data('dragging') === true) {
            return;
        }
        var pos = Widget.parseMilleseconds(e.currentPosition);
        $('#soundPosition').text(pos);
        Widget.widget.getCurrentSound(function(sound){
            $('#soundDuration').text(Widget.parseMilleseconds(sound.duration - e.currentPosition + 500));
        });
        $('#curPos').css('left', Math.floor(e.relativePosition * 284 - 3) + 'px');
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
    $('#timePos').on('mousedown', function(e){
        console.log($('#curPos').data('dragging'));
        $('#curPos').data('dragging', true);
    });
    $('#timePos').on('mousemove', function(e){
        if ($('#curPos').data('dragging') === true){
            $('#curPos').css('left', e.offsetX);
            Widget.widget.getCurrentSound(function(sound){
                $('#soundPosition').text(Widget.parseMilleseconds(sound.duration * e.offsetX / 284));
                $('#soundDuration').text(Widget.parseMilleseconds(sound.duration * (284 - e.offsetX) / 284 + 500));
            });
        }
    });
    $('#timePos').on('mouseup', function(e){
        Widget.widget.play();
        $('#curPos').data('dragging', false);
        var percentage = e.offsetX / 284;
        console.log(e.offsetX, percentage);
        Widget.widget.getCurrentSound(function(sound){
            Widget.widget.seekTo(Math.max(percentage * sound.duration, 0));
        });
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
