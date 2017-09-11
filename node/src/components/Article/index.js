import React from 'react'
import ReactDOM from 'react-dom'
import Footer from './Footer'
import $ from 'jquery'
import SoundCollection from '../SoundCollection'
import FavoritesCollection from '../SoundCollection/FavoritesCollection'
import Disqus from 'react-disqus-comments'

export default class Article extends React.Component
{
    constructor(props) {
        super(props)
        this.state = {
            id: '',
            content: '<p>Please wait...</p>',
            title: 'Loading...',
            series: []
        }
        this.parseServerFile()
    }
    
    parseServerFile() {
        $.get(this.props.path).done((contents) => {
            window.scroll(0, 0)
            this.setState(this.parsePageData(contents))
        }).fail((e) => {
            window.scroll(0, 0)
            this.setState(this.parsePageData(contents))
        })
    }

    componentDidUpdate() {
        if(this.props.path !== this.curPath) {
            this.curPath = this.props.path
            this.parseServerFile()
        }
    }

    parsePageData(contents) {
        const content = $(contents).find('#main').html()
        const headerContent = $(contents).find('header').html()
        const titleEl = $(headerContent).find('#title')
        const title = $(titleEl).html()
        const id = $(titleEl).attr('data-id')
        const type = $(titleEl).attr('data-type')
        document.title = title + ' | rickyrombo'
        return {
            id,
            title,
            type,
            content,
            headerContent
        }
    }

    render() {
        let child, disqus
        switch (this.props.path) {
            case '/favorites':
                child = <FavoritesCollection />
                break;
            case '/music':
                child = <SoundCollection path="/users/15831055/tracks" />
                break;
            default:
                if (this.state.type === 'posts') {
                    disqus = <Disqus
                        shortname="rickyrombo"
                        identifier={this.state.id}
                        title={this.state.title}
                        url={window.location.origin + this.props.path}
                    />
                }
                break;
        }
        return (
            <div className="content">
                <header className="header" dangerouslySetInnerHTML={{__html: this.state.headerContent}}></header>
                <div>
                    {child ? <div id="main">{child}</div> 
                           : <div id="main" dangerouslySetInnerHTML={{__html: this.state.content}}></div>}
                    {disqus}
                </div>
                <Footer />
            </div>
        )
    }
}
