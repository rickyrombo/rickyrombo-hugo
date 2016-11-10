import React from 'react';
import ReactDOM from 'react-dom';

export default class PlayerControls extends React.Component
{
    render() {
        return (
            <ul className="player-controls">
                <li><a onClick={this.props.onPrevTrack} className="prev-btn"><span className="control glyphicon glyphicon-fast-backward"></span></a></li>
                <li><a onClick={this.props.onPlayToggle}><span className={"glyphicon " + ((!this.props.isPlaying) ? "glyphicon-play" : "glyphicon-pause")}></span></a></li>
                <li><a onClick={this.props.onNextTrack} className="next-btn"><span className="control glyphicon glyphicon-fast-forward"></span></a></li>
            </ul>
        );
    }
}