import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import CssBaseline from '@mui/material/CssBaseline'
import { Experimental_CssVarsProvider as Experimental } from '@mui/material/styles'
import theme from './theme.js'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Experimental theme={theme}>
      <CssBaseline />
      <App />
    </Experimental>
  </React.StrictMode>,
)
