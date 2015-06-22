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
        this.$('.now-playing').text(this.currentSound.data.title);
        this.playhead.updatePlayhead(this.currentSound);
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
