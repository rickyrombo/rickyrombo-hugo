import React from 'react'
import ReactDOM from 'react-dom'
import App from './components/App'

if (!window.location.hash && window.location.pathname) {
    window.location = '/#' + window.location.pathname
}

window.addEventListener('sound-played', function(e) {
    document.getElementById('play-overlay-sound-' + e.detail).className = 'fa fa-pause';
})
window.addEventListener('sound-paused', function(e) {
    document.getElementById('play-overlay-sound-' + e.detail).className = 'fa fa-play'
})

ReactDOM.render(<App />, document.getElementById('app'))