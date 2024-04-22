import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BluetoothProvider } from './hooks/useBluetooth.jsx'
import { ComponentsProvider } from './hooks/useComponents.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ComponentsProvider>
      <BluetoothProvider>
        <App />
      </BluetoothProvider>
    </ComponentsProvider>
  </React.StrictMode>
)
