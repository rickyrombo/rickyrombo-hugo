import React from 'react'
import ReactDOM from 'react-dom'

export default class AlbumArt extends React.Component
{
    componentDidMount() {
        this.img.addEventListener('error', () => {this.img.src = this.props.sound.user.avatar_url}, false)
    }
    render() {
        return (
            <a href={this.props.sound.permalink_url} target='_blank' className='album-art'>
                <img ref={(img) => {this.img = img}} src={this.props.sound.artwork_url} alt='' />
            </a>
        )
    }
}