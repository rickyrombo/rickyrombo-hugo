function toTimestamp(ms) {
    var hours = Math.floor(ms/1000/60/60);
    var minutes = Math.floor(ms/1000/60) % 60;
    var seconds = Math.floor(ms/1000) % 60;
    return (hours ? hours + ':' : '') + minutes + ':' + ('0' + seconds).slice(-2)
}

define(['jquery', 'soundcloud_sdk', 'playhead'], function($, SC, Playhead){
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
            this.playhead = new Playhead(this);
            this.playlist = [193767403, 146785809, 145702406, 137999625, 130403447, 127606038, 119699390, 95331064, 73695745, 49109494, 46402737];
            this.load(this.playlist[0]);
        },
        registerClickEvents: function(){
            this.generatePlaylist();
            var $this = this;
            $(this.soundSelector).click(function(e){
               if (e.ctrlKey) {
                   return;
               }
               var id = $(this).attr($this.idAttrName);
               e.preventDefault();
                $this.load(id).done(function(){$this.play();});
            });
            this.load(this.playlist[0]);
        },
        generatePlaylist: function() {
            var playlist = [];
            var soundMap = {}
            var $this = this;
            $(this.soundSelector).each(function(){
                var soundId = $(this).attr($this.idAttrName);
                if(soundMap[soundId] === undefined) {
                    soundMap[soundId] = playlist.length;
                    playlist.push($(this).attr($this.idAttrName));
                }
            });
            this.soundMap = soundMap;
            this.playlist = playlist.length > 0 ? playlist : this.playlist;
        },
        load: function(id) {
            var d = $.Deferred();
            var $this = this;
            SC.stream('/tracks/' + id, function(sound){
                if ($this.currentSound) {
                    $this.currentSound.destruct();
                }
                SC.get('/tracks/' + id, function(sounddata) {
                    sound.load({
                        whileloading: $this.whilePlaying.bind($this)
                    });
                    sound.data = sounddata;
                    sound.id = id;
                    $this.currentSound = sound;
                    d.resolveWith(sound);
                });
            });
            return d;
        },
        resume: function() {
            if (this.currentSound && this.currentSound.paused) {
                this.currentSound.resume();
            } else {
                var $this = this;
                this.load(this.playlist[0]).done(function(){
                    $this.play();
                });
            }
        },
        play: function(){
            var $this = this;
            this.currentSound.play({
                onplay: $this.onPlay.bind($this),
                onresume: $this.onPlay.bind($this),
                onpause: $this.onStop.bind($this),
                onstop: $this.onStop.bind($this),
                whileplaying: $this.whilePlaying.bind($this),
                onfinish: $this.next.bind($this)
            });
        },
        pause: function() {
            this.currentSound.pause();
        },
        stop: function() {
            this.currentSound.stop();
        },
        next: function() {
            var $this = this;
            var currentIndex = this.soundMap[this.currentSound.id] || this.playlist.indexOf(this.currentSound.id);
            var nextId = this.playlist[(currentIndex + 1) % this.playlist.length];
            this.load(nextId).done(function(){$this.play();});
        },
        prev: function() {
            var $this = this;
            var currentIndex = this.soundMap[this.currentSound.id] || this.playlist.indexOf(this.currentSound.id);
            var nextId = this.playlist[(currentIndex - 1 + this.playlist.length) % this.playlist.length];
            this.load(nextId).done(function(){$this.play();});
        },
        onPlay: function(){
            this.$('.play-btn').hide();
            this.$('.pause-btn').show();
        },
        onStop: function(){
            this.$('.pause-btn').hide();
            this.$('.play-btn').show();
        },
        whilePlaying: function() {
            this.$('.now-playing').text(this.currentSound.data.title);
            this.playhead.updatePlayhead(this.currentSound);
        }
    };

    Widget.init();
    return Widget;
});