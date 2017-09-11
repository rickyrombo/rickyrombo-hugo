import React from 'react'
import ReactDOM from 'react-dom'
import SC from '../../soundcloud-init'

export default class PlayerSocialButtons extends React.Component
{
    constructor(props) {
        super(props)
        this.state = {
            liked: false,
            followed: false
        }
        this.onLikeClicked = this.onLikeClicked.bind(this)
        this.onFollowClicked = this.onFollowClicked.bind(this)
    }

    onLikeClicked() {
        SC.connect().then(() => {
            return SC.put('/me/favorites/' + this.props.sound.id)
        }).then((sound) => {
            this.setState({liked: true})
        }).catch((error) => {
            console.error('Error: ' + error.message)
        })
    }

    onFollowClicked() {
        SC.connect().then(() => {
            return SC.put('/me/followings/' + this.props.sound.user.id)
        }).then((user) => {
            this.setState({followed: true})
        }).catch((error) => {
            console.error('Error: ' + error.message)
        })
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.sound.id != nextProps.sound.id) {
            this.setState({liked: false, followed: false})
        }
    }

    render() {
        return (
        <ul className="soundcloud-controls pull-right">
            <li>
                <a onClick={this.onLikeClicked} className={(this.state.liked) ? 'on' : ''} title="Like this sound on Soundcloud" target="_blank">
                    <span className="glyphicon glyphicon-heart"></span>
                </a>
            </li>
            <li>
                <a onClick={this.onFollowClicked} className={(this.state.followed) ? 'on': ''} title="Follow this user on Soundcloud" target="_blank">
                    <span className="fa fa-user-plus"></span>
                </a>
            </li>
            { (this.props.sound.downloadable || this.props.sound.purchase_url) &&
            <li>
                <a href={(this.props.sound.downloadable) ? this.props.sound.download_url : this.props.sound.purchase_url} title="Get this sound" target="_blank">
                    <span className={"glyphicon " + ((this.props.sound.downloadable) ? "glyphicon-circle-arrow-down" : "glyphicon-shopping-cart")}></span>
                </a>
            </li>
            }
            <li>
                <a href={this.props.sound.permalink_url} title="View this sound on Soundcloud" target="_blank">
                    <span className="glyphicon glyphicon-share"></span>
                </a>
            </li>
        </ul>
        );
    }
}