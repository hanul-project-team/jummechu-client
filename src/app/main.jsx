import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import reduxStore from './reduxStore'
import App from './App'
import '../assets/styles/global.css'
import '../assets/styles/tailwind.css'


createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Provider store={reduxStore}>
      <StrictMode>
        <App />
      </StrictMode>
    </Provider>
  </BrowserRouter>,
)
