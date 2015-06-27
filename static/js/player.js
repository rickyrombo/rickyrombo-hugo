define(['jquery', 'soundcloud-widget', 'playhead'], function($, Widget, Playhead){

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
    };

    Player.prototype.whileLoading = Player.prototype.whilePlaying;

    Player.prototype.onLoad = function() {
        this.$('.now-playing-title').text(this.currentSound.data.title)
            .attr('href', this.currentSound.data.permalink_url);
        var playingFrom = this.playingFrom;
        if (!playingFrom){
            this.$('.now-playing-from').text('');
        } else{
            this.$('.now-playing-from').text('playing from ' + playingFrom.title)
                .attr('href', playingFrom.url);
        }
    };

    var getInstance = function() {
        if (instance == null){
            instance = new Player();
        }
        return instance;
    }

    var instance = null;
    return getInstance();
});
