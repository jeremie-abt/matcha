import React from 'react'
import ReactDOM from 'react-dom'
import AppRouter from './routes'
import axios from 'axios'

axios.defaults.baseURL = 'http://localhost:8081/api/'
ReactDOM.render(<AppRouter />, document.getElementById("root"))
