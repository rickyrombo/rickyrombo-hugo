define(['jquery', 'soundcloud-widget', 'playhead', 'nav'], function($, Widget, Playhead, nav){

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
            var soundcloudPath = this.currentSound.data.permalink_url;
            var postPath = '/tracks/' + soundcloudPath.split('soundcloud.com/')[1];
            $.get(postPath).done(function(result){
                var json = JSON.parse(result);
                $nowPlayingTitle.attr('href', json.posts[0].link);
                $nowPlayingTitle.attr('target', '_self');
                nav.refresh();
            }).fail(function(){
                $nowPlayingTitle.attr('href', soundcloudPath);
                $nowPlayingTitle.attr('target', '_blank');
                nav.refresh();
            });
            var playingFrom = this.playingFrom;
            if (!playingFrom){
                this.$('.now-playing-from').text('playing from "' + $('.page-title').text().toLowerCase().trim() + '"')
                    .attr('href', window.location.pathname);
            } else{
                this.$('.now-playing-from').text('playing from ' + playingFrom.title)
                    .attr('href', playingFrom.url);
            }
            $('.timeline .line').css('webkit-mask-image', 'url("'+this.currentSound.data.waveform_url+'")');
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
