import React from 'react'
import ReactDOM from 'react-dom'
import Navbar from './Navbar'
import Article from './Article'
import Player from './Player'
import ArtworkCollage from './ArtworkCollage'

export default class App extends React.Component 
{
    constructor(props) {
        super(props)
        this.state = { hash: window.location.hash }
        this.onHashChange = this.onHashChange.bind(this);
    }

    componentDidMount() {
        window.addEventListener('hashchange', this.onHashChange, false)
    }

    componentWillUnmount() {
        window.removeEventListener('hashchange', this.onHashChange)
    }

    onHashChange() {
        this.setState({hash: window.location.hash})
    }

    render() {
        let hash = this.state.hash
        if (hash.substr(-1) == '/') {
            hash = hash.substr(0, this.state.hash.length - 1)
        }
        hash = hash.substr(1)
        return (
            <div>
                <Navbar />
                <div id="wrapper">
                    <Article path={hash} />
                </div>
                <Player />
                <ArtworkCollage />
            </div>
        )
    }
}