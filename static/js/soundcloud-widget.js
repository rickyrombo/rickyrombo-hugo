function toTimestamp(ms) {
    var hours = Math.floor(ms/1000/60/60);
    var minutes = Math.floor(ms/1000/60) % 60;
    var seconds = Math.floor(ms/1000) % 60;
    return (hours ? hours + ':' : '') + minutes + ':' + ('0' + seconds).slice(-2)
}

define(['jquery', 'soundcloud_sdk'], function($, SC){
    var Widget = {
        playlist: [],
        soundMap: {},
        $el: $('#player'),
        soundSelector: 'a.sound-link',
        idAttrName: 'data-id',
        currentSound: null,
        init: function() {
            SC.initialize({
               client_id: '4790864defb6a0d7eb3017d49a31b273',
               redirect_uri: window.location.protocol + '//' + window.location.host + '/callback'
            });
            this.$ = this.$el.find.bind(this.$el);
            this.$('.play-btn').click(this.resume.bind(this));
            this.$('.pause-btn').click(this.pause.bind(this));
            this.$('.next-btn').click(this.next.bind(this));
            this.$('.prev-btn').click(this.prev.bind(this));
            this.$('.timeline').on('mousedown', function(e){
                if (Widget.currentSound && Widget.currentSound.playState === 0){
                    Widget.play();
                    Widget.pause();
                }
                Widget.$('.playhead').data('dragging', true);
                Widget.whileDraggingPlayhead.bind($(this))(e);
            });
            this.$('.timeline').on('mouseup', function(e){
                Widget.$('.playhead').data('dragging', false);
                var newPos = e.offsetX / $(this).width() * Widget.currentSound.duration;
                Widget.currentSound.setPosition(Math.max(newPos, 0));
            });
            this.$('.timeline').on('mousemove', Widget.whileDraggingPlayhead);
            this.$('.timeline').on('mouseout', function(e){
                Widget.$('.playhead').data('dragging', false);
                var newPos = e.offsetX / $(this).width() * Widget.currentSound.duration;
                Widget.currentSound.setPosition(Math.max(newPos, 0));
            });
            this.playlist = [193767403, 146785809, 145702406, 137999625, 130403447, 127606038, 119699390, 95331064, 73695745, 49109494, 46402737];
            this.load(this.playlist[0]);
        },
        registerClickEvents: function(){
            this.generatePlaylist();
            $(this.soundSelector).click(function(e){
               if (e.ctrlKey) {
                   return;
               }
               var id = $(this).attr(Widget.idAttrName);
               e.preventDefault();
               Widget.load(id).done(function(){Widget.play();});
            });
            this.load(this.playlist[0]);
        },
        generatePlaylist: function() {
            var playlist = [];
            var soundMap = {};
            $(this.soundSelector).each(function(){
                var soundId = $(this).attr(Widget.idAttrName);
                if(soundMap[soundId] === undefined) {
                    soundMap[soundId] = playlist.length;
                    playlist.push($(this).attr(Widget.idAttrName));
                }
            });
            this.soundMap = soundMap;
            this.playlist = playlist.length > 0 ? playlist : this.playlist;
        },
        load: function(id) {
            var d = $.Deferred();
            SC.stream('/tracks/' + id, function(sound){
                if (Widget.currentSound) {
                    Widget.currentSound.destruct();
                }
                SC.get('/tracks/' + id, function(sounddata) {
                    sound.load({
                        whileloading: Widget.whilePlaying
                    });
                    sound.data = sounddata;
                    sound.id = id;
                    Widget.currentSound = sound;
                    d.resolveWith(sound);
                });
            });
            return d;
        },
        resume: function() {
            if (this.currentSound && this.currentSound.paused) {
                this.currentSound.resume();
            } else {
                this.load(this.playlist[0]).done(function(){
                    Widget.play();
                });
            }
        },
        play: function(){
            this.currentSound.play({
                onplay: Widget.onPlay,
                onresume: Widget.onPlay,
                onpause: Widget.onStop,
                onstop: Widget.onStop,
                whileplaying: Widget.whilePlaying,
                onfinish: Widget.next.bind(Widget)
            });
        },
        pause: function() {
            this.currentSound.pause();
        },
        stop: function() {
            this.currentSound.stop();
        },
        next: function() {
            var currentIndex = this.soundMap[this.currentSound.id] || this.playlist.indexOf(this.currentSound.id);
            var nextId = this.playlist[(currentIndex + 1) % this.playlist.length];
            this.load(nextId).done(function(){Widget.play();});
        },
        prev: function() {
            var currentIndex = this.soundMap[this.currentSound.id] || this.playlist.indexOf(this.currentSound.id);
            var nextId = this.playlist[(currentIndex - 1 + this.playlist.length) % this.playlist.length];
            this.load(nextId).done(function(){Widget.play();});
        },
        onPlay: function(){
            Widget.$('.play-btn').hide();
            Widget.$('.pause-btn').show();
        },
        onStop: function(){
            Widget.$('.pause-btn').hide();
            Widget.$('.play-btn').show();
        },
        whilePlaying: function() {
            Widget.$('.now-playing').text(this.data.title);
            if (Widget.$('.playhead').data('dragging') === true) {
                return;
            }
            Widget.updatePlayhead(this);
            Widget.$('.sound-position').text(toTimestamp(this.position));
            Widget.$('.sound-duration').text(toTimestamp(this.durationEstimate - this.position + 500));
        },
        updatePlayhead: function(sound){
            var percentage = sound.position / sound.durationEstimate;
            var playhead = this.$('.playhead');
            var width = playhead.parent().width();
            var pos = width * percentage;
            playhead.css('left', pos + 'px');
        },
        whileDraggingPlayhead: function(e){
            if (Widget.$('.playhead').data('dragging') !== true) {
                return;
            }
            var x = e.offsetX;
            $(this).find('.playhead').css('left', x);
            var width = $(this).width();
            var position = Widget.currentSound.duration * x / width;
            var remaining = Widget.currentSound.duration * (width - x) / width;
            Widget.$('.sound-position').text(toTimestamp(position));
            Widget.$('.sound-duration').text(toTimestamp(remaining + 500));
        }
    };

    Widget.init();
    return Widget;
});