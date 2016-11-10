import React from 'react'
import ReactDOM from 'react-dom'

export default class Navbar extends React.Component
{
    constructor(props) {
        super(props)
        this.state = {show: false}
        this.toggleNav = this.toggleNav.bind(this)
    }

    toggleNav() {
        this.setState({show: !this.state.show})
    }

    render() {
        return (
            <nav className="rr-navbar navbar-inverse" role="navigation">
                <div className="container-fluid">
                    <a className="brand push-state" href="#">rickyrombo</a>
                    <button onClick={this.toggleNav} type="button" className={"navbar-toggle rr-collapse " + (this.state.show ? "" : "collapsed")} data-target=".rr-collapseable">
                        <span className="icon-bar"></span>
                        <span className="icon-bar"></span>
                        <span className="icon-bar"></span>
                    </button>

                    <ul className={"rr-nav rr-nav-main rr-collapseable no-redirect " + (this.state.show ? "rr-expanded" : "")}>
                        <li><a href="#/music">music</a></li>
                        <li><a href="#/series/intro-to-edm">intro to edm</a></li>
                        <li><a href="#/favorites">favorites</a></li>
                        <li><a href="#/about">about</a></li>
                    </ul>

                    <ul className={"rr-nav rr-nav-social rr-collapseable " + (this.state.show ? "rr-expanded" : "")}>
                        <li>
                            <a target="_blank" href="http://soundcloud.com/rickyrombo" title="RickyRombo on Soundcloud">
                                <i className="fa fa-soundcloud"></i><span className="social-text visible-xs-inline">soundcloud</span>
                            </a>
                        </li>
                        <li>
                            <a target="_blank" href="http://facebook.com/therickyrombo" title="RickyRombo on Facebook">
                                <i className="fa fa-facebook"></i><span className="social-text visible-xs-inline">facebook</span>
                            </a>
                        </li>
                    </ul>
                </div>
            </nav>
        )
    }
}