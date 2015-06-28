define(['jquery', 'soundcloud-widget'], function(){
    function toTimestamp(ms) {
        var totalSeconds = Math.floor(ms/1000);
        var totalMinutes = Math.floor(totalSeconds/60);
        var totalHours = Math.floor(totalMinutes/60);
        return (totalHours ? totalHours + ':' : '') + (totalMinutes % 60) + ':' + ('0' + (totalSeconds % 60)).slice(-2)
    }

    var Playhead = function(widget) {
        this.widget = widget;
        this.$el = widget.$('.timeline');
        this.$el.on('mousedown', this.initMovePlayhead.bind(this));
        this.$el.on('mouseup', this.movePlayhead.bind(this));
        this.$el.on('mouseout', this.movePlayhead.bind(this));
    };

    Playhead.prototype.movePlayhead = function(){
        var widget = this.widget;
        if (widget.$('.playhead').data('dragging') !== true){
            return;
        }
        widget.$('.playhead').data('dragging', false);
        this.$el.off('mousemove', this.whileDraggingPlayhead.bind(this));
        var newPos = widget.$('.playhead').width() / this.$el.width() * widget.currentSound.durationEstimate;
        widget.currentSound.setPosition(Math.max(newPos, 0));
    };

    Playhead.prototype.initMovePlayhead = function(e){
        var widget = this.widget;
        if (widget.currentSound && widget.currentSound.playState === 0){
            widget.play();
            widget.pause();
        }
        widget.$('.playhead').data('dragging', true);
        this.whileDraggingPlayhead.call(this, e);
        this.$el.on('mousemove', this.whileDraggingPlayhead.bind(this));
    };

    Playhead.prototype.whileDraggingPlayhead = function(e){
        var widget = this.widget;
        if (widget.$('.playhead').data('dragging') !== true) {
            return;
        }
        var x = e.offsetX;
        widget.$('.playhead').css('width', x);
        var width = this.$el.width();
        var position = this.widget.currentSound.durationEstimate * x / width;
        var remaining = this.widget.currentSound.durationEstimate * (width - x) / width;
        widget.$('.sound-position').text(toTimestamp(position));
        widget.$('.sound-duration').text(toTimestamp(remaining + 500));
    };

    Playhead.prototype.updatePlayhead = function(sound){
        if (this.widget.$('.playhead').data('dragging') === true) {
            return;
        }
        this.widget.$('.sound-position').text(toTimestamp(sound.position));
        this.widget.$('.sound-duration').text(toTimestamp(Math.floor(sound.durationEstimate / 1000) * 1000 - Math.floor(sound.position / 1000) * 1000));
        var percentage = sound.position / sound.durationEstimate;
        var playhead = this.widget.$('.playhead');
        var width = playhead.parent().width();
        var pos = width * percentage;
        playhead.css('width', pos + 'px');
        this.widget.$('.loadhead').css('width', sound.bytesLoaded/sound.bytesTotal * this.$el.width())
    };
    return Playhead;
});