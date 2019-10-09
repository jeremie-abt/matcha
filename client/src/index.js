import React from 'react'
import ReactDOM from 'react-dom'
import AppRouter from './routes'
import axios from 'axios'
import io from 'socket.io-client'

import '../src/style/app.sass'

const socketUrl = 'http://localhost:8000'
const socket = io.connect(socketUrl)
export default socket

axios.defaults.baseURL = 'http://localhost:8081/api/'
// donc la notree simple reactRouter
//ReactDOM.render(<AppRouter />, document.getElementById("root"))
// Maintenan le but va etre de faire un AppProvider qui va simlement me filer un context

ReactDOM.render(<AppRouter />, document.getElementById('root'))
