import React from 'react';
import ReactDOM from 'react-dom';
import Measure from 'react-measure';

export default class PlayerTimeline extends React.Component
{
    constructor(props) {
        super(props);
        this.state = {
            dimensions: {
                width: 0
            }
        }
    }
    getTimestamp(ms) {
        ms = (!ms) ? 0 : ms;
        var totalSeconds = Math.floor(ms/1000);
        var totalMinutes = Math.floor(totalSeconds/60);
        var totalHours = Math.floor(totalMinutes/60);
        return (totalHours ? totalHours + ':' : '') + (totalMinutes % 60) + ':' + ('0' + (totalSeconds % 60)).slice(-2)
    }
    getWidth() {
        var percentage = this.props.position / this.props.duration;
        var width = this.state.dimensions.width;
        var pos = width * percentage;
        return pos ? pos : 0;
    }
    onClick(e) {
        const xPos = e.offsetX ? e.offsetX : e.pageX - e.target.offsetLeft;
        const ms = this.props.duration * xPos / this.state.dimensions.width;
        this.props.seekTo(ms);
    }
    render() {
        return (
            <div className="player-timeline">
                <div className="time"><a className="sound-position">{this.getTimestamp(this.props.position)}</a></div>
                <div className="timeline" onClick={this.onClick.bind(this)}>
                    <Measure onMeasure={(dimensions) => {
                        this.setState({dimensions})
                    }}>
                        <div className="line-container">
                            <div className="playhead" style={{width: this.getWidth()}}></div>
                            <div className="line" style={{WebkitMaskImage: 'url(' + this.props.waveformUrl + ')'}} ></div>
                        </div>
                    </Measure>
                </div>
                <div className="time pull-right"><a className="sound-duration">{this.getTimestamp(this.props.duration)}</a></div>
            </div>
        );
    }
}