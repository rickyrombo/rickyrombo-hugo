import React from 'react'
import ReactDOM from 'react-dom'
import SC from '../../soundcloud-init'

export default class PlayerSocialButtons extends React.Component
{
    constructor(props) {
        super(props)
        this.onLikeClicked = this.onLikeClicked.bind(this)
        this.onFollowClicked = this.onFollowClicked.bind(this)
    }

    onLikeClicked() {
        SC.connect().then(() => {
            return SC.put('/me/likes/' + this.props.sound.id)
        }).then((sound) => {
            alert('You now like ' + sound.title)
        }).catch((error) => {
            alert('Error: ' + error.message)
        })
    }

    onFollowClicked() {
        SC.connect().then(() => {
            return SC.put('/me/followings/' + this.props.sound.user.id)
        }).then((user) => {
            alert('You are now following ' + user.username)
        }).catch((error) => {
            alert('Error: ' + error.message)
        })
    }

    render() {
        return (
        <ul className="soundcloud-controls pull-right">
            <li>
                <a onClick={this.onLikeClicked} title="Like this sound on Soundcloud" target="_blank">
                    <span className="glyphicon glyphicon-heart"></span>
                </a>
            </li>
            <li>
                <a onClick={this.onFollowClicked} title="Follow this user on Soundcloud" target="_blank">
                    <span className="fa fa-user-plus"></span>
                </a>
            </li>
            <li>
                <a href={(this.props.sound.download_url) ? this.props.sound.download_url : this.props.sound.purchase_url} title="Get this sound" target="_blank">
                    <span className={"glyphicon " + ((this.props.sound.download_url) ? "glyphicon-circle-arrow-down" : "glyphicon-shopping-cart")}></span>
                </a>
            </li>
            <li>
                <a href={this.props.sound.permalink_url} title="View this sound on Soundcloud" target="_blank">
                    <span className="glyphicon glyphicon-share"></span>
                </a>
            </li>
        </ul>
        );
    }
}