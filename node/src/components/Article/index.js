import React from 'react'
import ReactDOM from 'react-dom'
import MainContent from './MainContent'
import Footer from './Footer'
import $ from 'jquery'
import SoundCollection from '../SoundCollection'
import FavoritesCollection from '../SoundCollection/FavoritesCollection'

export default class Article extends React.Component
{
    constructor(props) {
        super(props)
        this.state = {
            content: '<p>Please wait...</p>',
            title: 'Loading...',
            series: []
        }
        this.parseServerFile()
    }
    
    parseServerFile() {
        $.get(this.props.path).done((contents) => {
            let content = $(contents).find('#main').html()
            let headerContent = $(contents).find('header').html()
            let title = $(headerContent).find('#title').html()
            document.title = title + ' | rickyrombo'
            window.scroll(0, 0)
            this.setState({
                content,
                headerContent
            })
        }).fail((e) => {
            let contents = e.responseText
            let content = $(contents).find('#main').html()
            let headerContent = $(contents).find('header').html()
            let title = $(headerContent).find('#title').html()
            document.title = title + ' | rickyrombo'
            window.scroll(0, 0)
            this.setState({
                content,
                headerContent
            })
        })
    }

    componentDidUpdate() {
        if(this.props.path !== this.curPath) {
            this.curPath = this.props.path
            this.parseServerFile()
        }
    }

    render() {
        let child
        switch (this.props.path) {
            case '/favorites':
                child = <FavoritesCollection />
                break;
            case '/music':
                child = <SoundCollection path="/users/rickyrombo/tracks" />
                break;
        }
        return (
            <div className="content">
                <header className="header" dangerouslySetInnerHTML={{__html: this.state.headerContent}}></header>
                <MainContent content={this.state.content}>
                {child}
                </MainContent>
                <Footer />
            </div>
        )
    }
}