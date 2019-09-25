import React from 'react'
import ReactDOM from 'react-dom'
import AppRouter from './routes'
import axios from 'axios'

import '../src/style/app.sass'

axios.defaults.baseURL = 'http://localhost:8081/api/'
// donc la notree simple reactRouter
//ReactDOM.render(<AppRouter />, document.getElementById("root"))
// Maintenan le but va etre de faire un AppProvider qui va simlement me filer un context

ReactDOM.render(<AppRouter />, document.getElementById('root'))
