import React from 'react'
import ReactDOM from 'react-dom'
import App from './components/App'

if (!window.location.hash && window.location.pathname) {
    window.location = '/#' + window.location.pathname
}

window.addEventListener('sound-played', function(e) {
    var el = document.getElementById('play-overlay-sound-' + e.detail)
    if (el) {
        el.className = 'fa fa-pause';
    }
})
window.addEventListener('sound-paused', function(e) {
    var el = document.getElementById('play-overlay-sound-' + e.detail)
    if (el) {
        el.className = 'fa fa-play'
    }
})

ReactDOM.render(<App />, document.getElementById('app'))