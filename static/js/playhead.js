define(['jquery', 'soundcloud-widget'], function($, Widget){

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
        var newPos = widget.$('.playhead').position().left / this.$el.width() * widget.currentSound.durationEstimate;
        widget.currentSound.setPosition(Math.max(newPos, 0));
    };

    Playhead.prototype.initMovePlayhead = function(e){
        var widget = this.widget;
        if (widget.currentSound && widget.currentSound.playState === 0){
            widget.play();
            widget.pause();
        }
        widget.$('.playhead').data('dragging', true);
        this.whileDraggingPlayhead.bind(this)(e);
        this.$el.on('mousemove', this.whileDraggingPlayhead.bind(this));
    };

    Playhead.prototype.whileDraggingPlayhead = function(e){
        var widget = this.widget;
        if (widget.$('.playhead').data('dragging') !== true) {
            return;
        }
        var x = e.offsetX;
        widget.$('.playhead').css('left', x);
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
        this.widget.$('.sound-duration').text(toTimestamp(sound.durationEstimate - sound.position + 500));
        var percentage = sound.position / sound.durationEstimate;
        var playhead = this.widget.$('.playhead');
        var width = playhead.parent().width();
        var pos = width * percentage;
        playhead.css('left', pos + 'px');
    };

    return Playhead;
});