import React from 'react';
import ReactDOM from 'react-dom';
import PlayerControls from './PlayerControls';
import PlayerNowPlaying from './PlayerNowPlaying';
import PlayerSocialButtons from './PlayerSocialButtons';
import SC from '../../soundcloud-init';

export default class Player extends React.Component 
{
    constructor(props) {
        super(props)

        // Init state
        this.state = {
            sound: {
                user: {} 
            },
            player: false
        }

        // Load initial track
        // SC.get('/tracks/' + 293).then((sound) => {
        //     this.setState({sound})
        //     this.getStream()
        // })

        window.addEventListener('sound-clicked', (e) => {
            if (this.state.sound.id == e.detail && this.state.player) {
                this.playToggle()
            } else {
                this.playById(e.detail)
                this.parsePlaylist()
            }
        })

        // Bind self to event handlers
        this.onPrevTrack = this.seekTrack.bind(this, -1)
        this.onNextTrack = this.seekTrack.bind(this, 1)
        this.onPlayToggle = this.playToggle.bind(this)
        this.seekTo = this.seekTo.bind(this)
    }

    playById(id) {
        if (id == null) {
            this.playToggle()
            return
        }
        return SC.get('/tracks/' + id).then((sound) => {
            this.setState({sound})
            this.getStream({sound, play: true})
        })
    }

    parsePlaylist() {
        let soundLinks = Array.from(document.getElementsByClassName('sound-link'))
        let soundIds = {}
        let lastId = null
        for (let i = 0, len = soundLinks.length; i < len; i++) {
            let curId = soundLinks[i].getAttribute('data-id')
            soundIds[curId] = {
                prev: lastId,
                next: null
            }
            if (lastId) {
                soundIds[lastId].next = curId
            }
            lastId = curId
        }
        this.playlist = soundIds
    }

    playToggle() {
        this.state.player.toggle()
    }

    seekTrack(direction) {
        this.stop()
        if (this.playlist) {
            if (direction > 0) {
                this.playById(this.playlist[this.state.sound.id].next)
            } else {
                this.playById(this.playlist[this.state.sound.id].prev)
            }
        }
    }

    stop() {
        this.state.player.pause()
        this.state.player.seek(0)
    }

    seekTo(ms) {
        this.state.player.seek(ms);
    }

    getStream(options = {}) {
        let id = options.sound ? options.sound.id : this.state.sound.id
        SC.stream('/tracks/' + id).then((player) => {
            // Needed to force chrome to http streaming
            if (player.options.protocols[0] === 'rtmp') {
                player.options.protocols.splice(0, 1)
            }
            player.on('time', () => {
                this.setState({position: player.currentTime()})
            })
            player.on('seeked', () => {
                this.setState({position: player.currentTime()})
            })
            player.on('state-change', (e) => {
                if (e == 'playing') {
                    this.setState({isPlaying: true})
                    window.dispatchEvent(new CustomEvent('sound-played', { detail: id }))
                } else if (e == 'paused') {
                    this.setState({isPlaying: false})
                    window.dispatchEvent(new CustomEvent('sound-paused', { detail: id }))
                }
            })
            player.on('finish', () => {
                this.seekTrack(1)
            })
            this.setState({player})
            if (options.play) {
                this.state.player.play()
            }
        })
    }

    render() {
        return (
            <div className="player">
                <div className="container-fluid">
                    <PlayerControls onNextTrack={this.onNextTrack} onPrevTrack={this.onPrevTrack} onPlayToggle={this.onPlayToggle} isPlaying={this.state.isPlaying} />
                    <PlayerNowPlaying sound={this.state.sound} position={this.state.position} seekTo={this.seekTo}/>
                    <PlayerSocialButtons sound={this.state.sound} />
                </div>
            </div>
            )
    }
}