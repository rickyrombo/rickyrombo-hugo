import React from 'react'
import ReactDOM from 'react-dom'

export default class Footer extends React.Component
{
    render() {
        return (
            <footer id="footer" className="footer">
                <p>All cover art and music is provided using <a target="_blank" title="Soundcloud.com" href="http://soundcloud.com">Soundcloud</a>. Background cover art are those of <a target="_blank" title="View on Soundcloud" href="http://soundcloud.com/rickyrombo/favorites">RickyRombo's favorites</a></p>
                <p>Copyright &copy;2015 Marcus Pasell - All Rights Reserved</p>
            </footer>
        )
    }
}