import React from 'react';
import ReactDOM from 'react-dom';
import PlayerTimeline from './PlayerTimeline'

export default class PlayerNowPlaying extends React.Component
{
    constructor(props) {
        super(props);
    }

    render() {
        return (
        <ul className="now-playing">
            <li className="current-sound">
                <a className="now-playing-title" target="_blank">{this.props.sound.title}</a>
                <a className="now-playing-from" title="Go to Soundcloud Profile" target="_blank" href={this.props.sound.user.permalink_url}>{this.props.sound.user.username}</a>
                <a className="now-playing-from"></a>
            </li>
            <PlayerTimeline 
                position={this.props.position} 
                duration={this.props.sound.duration} 
                waveformUrl={this.props.sound.waveform_url}
                seekTo={this.props.seekTo}
            />
        </ul>
        );
    }
}