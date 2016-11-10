import React from 'react';
import ReactDOM from 'react-dom';

export default class PlayerSocialButtons extends React.Component
{
    render() {
        return (
        <ul className="soundcloud-controls pull-right">
            <li><a title="Like this sound on Soundcloud" target="_blank"><span className="glyphicon glyphicon-heart"></span></a></li>
            <li><a href={this.props.sound.user.permalink_url} title="Follow this user on Soundcloud" target="_blank"><span className="fa fa-user-plus"></span></a></li>
            <li><a href={(this.props.sound.download_url) ? this.props.sound.download_url : this.props.sound.buy_url} title="Get this sound" target="_blank"><span className={"glyphicon " + ((this.props.sound.download_url) ? "glyphicon-circle-arrow-down" : "glyphicon-shopping-cart")}></span></a></li>
            <li><a href={this.props.sound.permalink_url} title="View this sound on Soundcloud" target="_blank"><span className="glyphicon glyphicon-share"></span></a></li>
        </ul>
        );
    }
}