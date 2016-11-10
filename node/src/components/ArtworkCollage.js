import React from 'react';
import ReactDOM from 'react-dom';
import SC from '../soundcloud-init';

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
                    return (<a key={sound.id + i} href={sound.permalink_url} target='_blank' className='album-art'>
                        <img src={sound.artwork_url} alt='' />
                    </a>);
                })
            }
            </div>
        );
    }
}