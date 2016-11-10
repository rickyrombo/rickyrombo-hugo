import React from 'react'
import ReactDOM from 'react-dom'
import App from './components/App'

if (!window.location.hash && window.location.pathname) {
    window.location = '/#' + window.location.pathname
}
ReactDOM.render(<App />, document.getElementById('app'))