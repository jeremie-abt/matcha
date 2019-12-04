import React from 'react'
import ReactDOM from 'react-dom'
import AppRouter from './routes'
import axios from 'axios'

/*
import SocketConnection from './context/socket'

SocketConnection()
*/
import '../src/style/app.sass'
/*
const socketUrl = 'http://localhost:8000'
const socket = io.connect(socketUrl)
*/
axios.defaults.baseURL = 'http://localhost:8081/api/'

ReactDOM.render(<AppRouter />, document.getElementById('root'))
