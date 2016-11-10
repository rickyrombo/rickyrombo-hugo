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
    }

    componentDidMount() {
        SC.get(this.props.path, {limit: 48}).then((sounds) => {
            this.setState({sounds})
        })
    }

    render() {
        let i = 0
        return <div className="tracks">
            {this.state.sounds.length == 0 ? <h3>Loading...</h3> : ''}
            {this.state.sounds.map((sound) => {
                return (
                    <Sound key={sound.id} sound={sound} />
                    ) 
            })}
            </div>
    }
}