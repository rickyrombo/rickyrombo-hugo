import React from 'react'
import ReactDOM from 'react-dom'
import SC from '../../soundcloud-init'
import AlbumArt from './AlbumArt'

export default class ArtworkCollage extends React.Component
{
    constructor(props) {
        super(props);
        this.state = { sounds: [] };
    }

    componentDidMount() {
        SC.get('/users/rickyrombo/favorites', {limit: 100}).then((sounds) =>{
            let repeatedSounds = sounds;
            for (let i = 0; i < 5; i++) {
                repeatedSounds = [...repeatedSounds, ...sounds];
            }
            this.setState({sounds: repeatedSounds});
        });
    }

    render() {
        return (
            <div className="collage-container">
            {
                this.state.sounds.map((sound, i) => {
                    return (<AlbumArt sound={sound} key={i} />);
                })
            }
            </div>
        );
    }
}