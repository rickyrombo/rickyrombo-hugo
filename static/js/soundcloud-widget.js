define(['jquery', 'soundcloud_sdk'], function($, SC){

    var Widget = function(el, soundSelector, soundIdAttrName){
        SC.initialize({
            client_id: '4790864defb6a0d7eb3017d49a31b273',
            redirect_uri: window.location.protocol + '//' + window.location.host + '/callback'
        });
        this.playlist = [];
        this.soundMap = {};
        this.$el = el || $('#player');
        this.soundSelector = soundSelector || 'a.sound-link';
        this.idAttrName = soundIdAttrName || 'data-id';
        this.currentSound = null;
        this.playingFrom = false;
        this.connected = false;
        this.SC = SC;
        this.$ = this.$el.find.bind(this.$el);
    };

    Widget.prototype.registerClickEvents = function(){
        if (!this.currentSound || this.currentSound.playState === 0){
            this.generatePlaylist();
            this.load(this.playlist[0]);
        }
        var $this = this;
        $(this.soundSelector).click(function(e){
            if (e.ctrlKey) {
                return;
            }
            e.preventDefault();
            var id = Number($(this).attr($this.idAttrName));
            $this.generatePlaylist();
            $this.load(id).done(function(){$this.play();});
        });
    };

    Widget.prototype.generatePlaylist = function() {
        var playlist = [];
        var soundMap = {};
        var $this = this;
        $(this.soundSelector).each(function(){
            var soundId = Number($(this).attr($this.idAttrName));
            if(soundMap[soundId] === undefined) {
                soundMap[soundId] = playlist.length;
                $this.playingFrom = JSON.parse($(this).attr('data-playing-from') || false);
                playlist.push(soundId);
            }
        });
        this.soundMap = soundMap;
        this.playlist = playlist.length > 0 ? playlist : this.playlist;
    };

    Widget.prototype.load = function(id) {
        id = Number(id);
        var d = $.Deferred();
        var $this = this;
        SC.stream('/tracks/' + id, function(sound){
            if ($this.currentSound) {
                $this.currentSound.destruct();
            }
            SC.get('/tracks/' + id, function(sounddata) {
                sound.load({
                    whileloading: $this.whileLoading.bind($this),
                    onload: $this.onLoad.bind($this)
                });
                sound.data = sounddata;
                sound.id = id;
                $this.currentSound = sound;
                d.resolveWith(sound);
            });
        });
        return d;
    }

    Widget.prototype.resume = function() {
        if (this.currentSound && this.currentSound.paused) {
            this.currentSound.resume();
        } else {
            var $this = this;
            this.load(this.playlist[0]).done(function(){
                $this.play();
            });
        }
    };

    Widget.prototype.play = function(){
        var $this = this;
        this.currentSound.play({
            onplay: $this.onPlay.bind($this),
            onresume: $this.onPlay.bind($this),
            onpause: $this.onStop.bind($this),
            onstop: $this.onStop.bind($this),
            whileplaying: $this.whilePlaying.bind($this),
            onfinish: $this.next.bind($this)
        });
    };

    Widget.prototype.pause = function() {
        this.currentSound.pause();
    };

    Widget.prototype.stop = function() {
        this.currentSound.stop();
    };

    Widget.prototype.next = function(restart) {
        var $this = this;
        var currentIndex = this.soundMap[this.currentSound.id] || this.playlist.indexOf(this.currentSound.id);
        var nextIndex = (currentIndex + 1) % this.playlist.length;
        if (restart !== true && nextIndex < currentIndex) {
            this.loadMore();
        } else {
            var nextId = this.playlist[nextIndex];
            //TODO: make autoplay optional
            this.load(nextId).done(function(){$this.play();});
        }
    };

    Widget.prototype.loadMore = function(){
        var $this = this;
        var from = this.playingFrom;
        if (!from || !from.api_path){
            $this.next(true);
            return;
        }
        from.opts.offset += from.opts.limit;
        SC.get(from.api_path, from.opts, function(sounds){
            sounds.forEach(function(sound){
                $this.soundMap[sound.id] = $this.playlist.length;
                $this.playlist.push(sound.id);
            });
            $this.next(true);
        });
    };

    Widget.prototype.prev = function() {
        var $this = this;
        var currentIndex = this.soundMap[this.currentSound.id] || this.playlist.indexOf(this.currentSound.id);
        var nextId = this.playlist[(currentIndex - 1 + this.playlist.length) % this.playlist.length];
        this.load(nextId).done(function(){$this.play();});
    };

    Widget.prototype.onPlay = function(){};

    Widget.prototype.onStop = function(){};

    Widget.prototype.whilePlaying = function() {};

    Widget.prototype.whileLoading = function() {};

    Widget.prototype.onLoad = function() {};

    Widget.prototype.connect = function(callback) {
        var $this = this;
        return SC.connect(function(){
            $this.connected = true;
            return callback && callback();
        })
    };

    return Widget;
});