import React from 'react'
import ReactDOM from 'react-dom'
import SC from '../../soundcloud-init'
import Sound from './Sound'

export default class SoundCollection extends React.Component
{
    constructor(props) {
        super(props);
        this.state = {
            sounds: []
        }
        this.offset = 0
        this.onScroll = this.onScroll.bind(this)
    }

    appendSounds() {
        return SC.get(this.props.path, {offset: this.offset, limit: 48}).then((sounds) => {
            this.offset += 48
            this.setState({sounds: [...this.state.sounds, ...sounds]})
            this.loadMore = sounds.length > 0
            return sounds
        }).catch(console.error)
    }

    componentDidMount() {
        this.appendSounds()
        window.addEventListener('scroll', this.onScroll, false)
    }

    onScroll(e) {
        if (this.node && this.node.offsetTop + this.node.offsetHeight - window.innerHeight * 3 < window.scrollY && this.loadMore) {
            this.loadMore = false
            this.appendSounds()
        }
        
    }

    render() {
        let i = 0
        return <div ref={(container) => this.node = container} className="tracks">
            {this.state.sounds.length == 0 ? <h3>Loading...</h3> : ''}
            {this.state.sounds.map((sound) => {
                return (
                    <Sound key={sound.id} sound={sound} />
                    ) 
            })}
            </div>
    }
}