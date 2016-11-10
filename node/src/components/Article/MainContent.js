import React from 'react'
import ReactDOM from 'react-dom'
import $ from 'jquery'

export default class MainContent extends React.Component
{
    render() {
        if (!this.props.children) {
            return (
                <div id="main" dangerouslySetInnerHTML={{__html: this.props.content}}>
                </div>
            )
        }
        return (
            <div id="main">
                {this.props.children}
            </div>
        )
    }
}