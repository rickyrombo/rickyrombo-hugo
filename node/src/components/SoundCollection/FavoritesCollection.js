import React from 'react'
import ReactDOM from 'react-dom'
import SoundCollection from './index'

export default class FavoritesCollection extends React.Component
{
    render() {
        return <SoundCollection path="/users/rickyrombo/favorites"/>
    }
}