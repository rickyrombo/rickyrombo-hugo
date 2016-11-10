import React from 'react'
import ReactDOM from 'react-dom'
import Header from './Header'
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
            content: '<p>Whoops. Looks like this moved or doesn\'t exist anymore!</p>',
            title: 'Page not found',
            series: []
        }
    }
    
    parseServerFile() {
        $.get(this.props.path).done((contents) => {
            let content = $(contents).find('#main').html()
            let headerContent = $(contents).find('header').html()
            let title = $(headerContent).find('#title').html()
            let description = $(headerContent).find('#description').html()
            let series = []
            $(headerContent).find('.series-link').each(function() {
                series.push({name: $(this).html(), url: $(this).attr('href')})
            })
            this.setState({
                content,
                title,
                description,
                series
            })
        }).fail((e) => {
            console.error(e)
        })
    }

    render() {
        let child
        if(this.props.path !== this.curPath) {
            this.curPath = this.props.path
            this.parseServerFile()
        }
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
                <Header title={this.state.title} 
                    series={this.state.series} 
                    description={this.state.description} 
                    singular={this.state.singular}
                    />
                <MainContent content={this.state.content}>
                {child}
                </MainContent>
                <Footer />
            </div>
        )
    }
}