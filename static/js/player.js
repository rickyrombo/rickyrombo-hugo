define(['jquery', 'underscore', 'soundcloud-widget', 'playhead', 'nav'], function($, _, Widget, Playhead, nav){

    function Player() {
        Widget.call(this, $('#player'), 'a.sound-link', 'data-id');
        this.init();
    }

    Player.prototype = new Widget();

    Player.prototype.constructor = Player;

    Player.prototype.init = function() {
        this.$('.play-btn').click(this.resume.bind(this));
        this.$('.pause-btn').click(this.pause.bind(this));
        this.$('.next-btn').click(this.next.bind(this));
        this.$('.prev-btn').click(this.prev.bind(this));
        this.playlist = [193767403, 146785809, 145702406, 137999625, 130403447, 127606038, 119699390, 95331064, 73695745, 49109494, 46402737];
        this.load(this.playlist[0]);
        this.playhead = new Playhead(this);
        this.registerUI();
    }

    Player.prototype.registerUI = function() {
        var $this = this;
        $('.like-sound').click(function(e){
            e.preventDefault();
            $this.like($(this).attr($this.idAttrName));
        });
        $('.follow-user').click(function(e){
            e.preventDefault();
            $this.follow($(this).attr($this.idAttrName));
        });
    }

    Player.prototype.onPlay = function(){
        this.$('.play-btn').hide();
        this.$('.pause-btn').show();
    };

    Player.prototype.onStop = function(){
        this.$('.pause-btn').hide();
        this.$('.play-btn').show();
    };

    Player.prototype.whilePlaying = function() {
        this.playhead.updatePlayhead(this.currentSound);
        var $nowPlayingTitle = this.$('.now-playing-title');
        var $this = this;
        if ($nowPlayingTitle.text() !== this.currentSound.data.title){
            $nowPlayingTitle.text(this.currentSound.data.title);
            var playingFrom = this.playingFrom;
            if (!playingFrom){
                this.$('.now-playing-from').text('playing from "' + $('.page-title').text().toLowerCase().trim() + '"')
                    .attr('href', window.location.pathname);
            } else{
                this.$('.now-playing-from').text('playing from ' + playingFrom.title)
                    .attr('href', playingFrom.url);
            }
            $('.timeline .line').css('webkit-mask-image', 'url("'+this.currentSound.data.waveform_url+'")');
            this.refreshUI();
            $('.sound').removeClass('active');
            $('#sound-' + this.currentSound.id).addClass('active');
        }
    };

    Player.prototype.refreshGetSoundButton = function() {
        var sound = this.currentSound.data;
        var download_url = sound.download_url
            || (sound.purchase_url
                && (sound.purchase_url.indexOf('toneden')
                    || sound.purchase_url.indexOf('songchimp')
                    || sound.purchase_url.indexOf('unlockthis')
                    || sound.purchase_url.indexOf('facebook')
                    || sound.purchase_url.indexOf('click.dj')));
        if (sound.purchase_url && !download_url){
            this.$('.buy-sound').parent().show();
            this.$('.buy-sound').attr('href', this.currentSound.data.purchase_url);
        } else {
            this.$('.buy-sound').parent().hide();
        }
        if (download_url) {
            this.$('.download-sound').parent().show();
            this.$('.download-sound').attr('href', this.currentSound.data.download_url || this.currentSound.data.purchase_url);
        } else {
            this.$('.download-sound').parent().hide();
        }
    };

    Player.prototype.refreshUI = function() {
        var sound = this.currentSound.data;
        var $this = this;
        this.refreshGetSoundButton();
        this.$('.follow-user').attr('title', 'Follow ' + sound.user.username + ' on Soundcloud');
        this.$('.like-sound').attr(this.idAttrName, sound.id);
        this.$('.follow-user').attr(this.idAttrName, sound.user.id);
        this.$('.view-sound').attr('href', sound.permalink_url);
        if (this.connected) {
            this.SC.get('/me/favorites/' + sound.id, function(e) {
                if (!e.errors){
                    $this.$('.like-sound').addClass('on');
                } else {
                    $this.$('.like-sound').removeClass('on');
                }
            });
            // for some reason, GET /me/followings/{id} throws 401
            // better hope that the follow is in the first 200.....
            this.SC.get('/me/followings', {limit: 200}, function(followings){
                var foundUser = _.findWhere(followings, {id: sound.user.id});
                if(foundUser !== undefined){
                    $this.$('.follow-user').addClass('on');
                } else {
                    $this.$('.follow-user').removeClass('on');
                }
            })
        }
        var soundcloudPath = sound.permalink_url;
        var postPath = '/tracks/' + soundcloudPath.split('soundcloud.com/')[1];
        var $nowPlayingTitle = $this.$('.now-playing-title');
        $.get(postPath).done(function(result){
            var json = JSON.parse(result);
            $nowPlayingTitle.attr('href', json.posts[0].link);
            $this.$('.read-post').attr('href', json.posts[0].link).show();
            $nowPlayingTitle.attr('target', '_self');
            nav.refresh();
        }).fail(function(){
            $this.$('.read-post').hide();
            $nowPlayingTitle.attr('href', soundcloudPath);
            $nowPlayingTitle.attr('target', '_blank');
            nav.refresh();
        });
    };

    Player.prototype.like = function(id, callback) {
        id = Number(id);
        var $this = this;
        if (!$this.connected) {
            $this.connect($this.refreshUI.bind($this));
        } else {
            $this.SC.get('/me/favorites/' + id, function(e){
                if (e.errors){
                    $this.SC.put('/me/favorites/' + id, function() {
                        $this.refreshUI();
                        return callback && callback();
                    });
                } else {
                    $this.SC.delete('/me/favorites/' + id, function() {
                        $this.refreshUI();
                        return callback && callback();
                    })
                }
            });
        }
    };

    Player.prototype.follow = function(id, callback) {
        id = Number(id);
        var $this = this;
        if (!$this.connected){
            $this.connect($this.refreshUI.bind($this));
        } else {
            // for some reason, GET /me/followings/{id} throws 401
            // better hope that the follow is in the first 200.....
            $this.SC.get('/me/followings', {limit: 200}, function(followings){
                var foundUser = _.findWhere(followings, {id: id});
                if(foundUser === undefined){
                    $this.SC.put('/me/followings/' + id, function(){
                        $this.refreshUI();
                        return callback && callback();
                    });
                } else {
                    $this.SC.delete('/me/followings/' + id, function(){
                        $this.refreshUI();
                        return callback && callback();
                    });
                }
            });
        }
    };

    Player.prototype.whileLoading = Player.prototype.whilePlaying;

    Player.prototype.onLoad = Player.prototype.whilePlaying;

    var getInstance = function() {
        if (instance == null){
            instance = new Player();
        }
        return instance;
    }

    var instance = null;
    return getInstance();
});
