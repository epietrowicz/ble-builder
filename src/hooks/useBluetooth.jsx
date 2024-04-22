import React, { useState, useContext, createContext } from 'react'
import { useComponents } from './useComponents'

const BluetoothContext = createContext()

export const useBluetooth = () => {
  const context = useContext(BluetoothContext)
  if (!context) {
    throw new Error('useComponents must be used within an ComponentsProvider')
  }
  return context
}

export const BluetoothProvider = ({ children }) => {
  const { components } = useComponents()
  const [connectionState, setConnectionState] = useState('DISCONNECTED')
  const [device, setDevice] = useState(null)
  const [gattServer, setGattServer] = useState(null)
  const [error, setError] = useState(null)
  const [scanFilter, setScanFilter] = useState('')

  const disconnectDevice = () => {
    if (device && device.gatt.connected) {
      device.gatt.disconnect()
    }
    setDevice(null)
    setGattServer(null)
    setConnectionState('DISCONNECTED')
  }

  const connectToDevice = async () => {
    try {
      let services = components.map(c => c.serviceUuid)
      services = [...new Set(services)]
      let connectionParams = { optionalServices: services }

      if (scanFilter === '') {
        connectionParams = { ...connectionParams, acceptAllDevices: true }
      } else {
        connectionParams = { ...connectionParams, filters: [{ namePrefix: scanFilter }] }
      }

      const device = await navigator.bluetooth.requestDevice(connectionParams)
      device.addEventListener('gattserverdisconnected', disconnectDevice)
      const server = await device.gatt.connect()

      setGattServer(server)
      setDevice(device)
      setConnectionState('CONNECTED')

      //   const server = await device.gatt.connect()
      //   const temperatureService = await server.getPrimaryService(ADAFRUIT_TEMPERATURE_SERVICE_UUID)
      //   const tempCharacteristic = await temperatureService.getCharacteristic(ADAFRUIT_TEMPERATURE_CHARACTERISTIC_UUID)

      //   await tempCharacteristic.startNotifications()
      //   tempCharacteristic.addEventListener('characteristicvaluechanged', notifyEventChange)

    //   setConnectedDevice(server)
    } catch (err) {
      console.error('Failed to connect to Bluetooth device:', err)
      setError(err)
    }
  }

  return (
    <BluetoothContext.Provider value={{
      device,
      error,
      connectionState,
      setScanFilter,
      disconnectDevice,
      connectToDevice
    }}
    >
      {children}
    </BluetoothContext.Provider>
  )
}
