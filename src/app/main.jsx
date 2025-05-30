// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { ToastContainer } from 'react-toastify'
import reduxStore from './reduxStore'
import App from './App'
import '../assets/styles/global.css'
import '../assets/styles/tailwind.css'
import '../assets/styles/toastify.css'
import 'react-toastify/dist/ReactToastify.css'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Provider store={reduxStore}>
      <App />
      <ToastContainer
        autoClose={3000}
        pauseOnHover={false}
        hideProgressBar={true}
        closeButton={false}
      />
    </Provider>
  </BrowserRouter>
)
