import React from 'react'
import ReactDOM from 'react-dom'

export default class Sound extends React.Component
{
    onSoundClick(e) {
        let soundEvent = new CustomEvent('sound-clicked', {detail: this.props.sound.id})
        window.dispatchEvent(soundEvent);
        e.preventDefault();
        return false;
    }

    componentDidMount() {
        this.art.addEventListener('error', (e) => {
            this.art.src = this.props.sound.user.avatar_url
        }, false)
    }

    render() {
        let art = this.props.sound.artwork_url ? this.props.sound.artwork_url : this.props.sound.user.avatar_url;
        art = art.replace(/large/, 't500x500')
        return (
            <div id={'sound-' + this.props.sound.id } className="sound sound-grid">
                <div className="full-art">
                    <h3><a target="_blank" href={this.props.sound.permalink_url} title={"View " + this.props.sound.title + " by " + this.props.sound.user.username + " on SoundCloud"}>{this.props.sound.title}</a></h3>
                    <a onClick={this.onSoundClick.bind(this)}
                        data-id={this.props.sound.id}
                        className="sound-link"
                        href={this.props.sound.permalink_url}
                        title={"Play "+ this.props.sound.title + " by " + this.props.sound.user.username }>
                        <img src={art} ref={(art) => {this.art = art}} />
                    </a>
                </div>
            </div>
        )
    }
}