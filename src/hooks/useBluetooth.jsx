import React, { useState, useContext, createContext, useEffect, useMemo } from 'react'
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
  const { components, updateComponent } = useComponents()
  const [connectionState, setConnectionState] = useState('DISCONNECTED')
  const [device, setDevice] = useState(null)
  const [gattServer, setGattServer] = useState(null)
  const [error, setError] = useState(null)
  const [scanFilter, setScanFilter] = useState('')

  useEffect(() => {
    if (device === null) {
      for (const component of components) {
        component.bluetoothProperties.state = 'DISCONNECTED'
        component.bluetoothProperties.gattCharacteristic = null
        component.bluetoothProperties.gattService = null
        updateComponent(component)
      }
      setConnectionState('DISCONNECTED')
    }
  }, [JSON.stringify(device)])

  useEffect(() => {
    if (gattServer !== null) {
      parseCharacteristics(gattServer)
    }
  }, [JSON.stringify(components), JSON.stringify(gattServer)])

  const disconnectDevice = () => {
    if (device && device.gatt.connected) {
      device.gatt.disconnect()
    }

    setDevice(null)
    setGattServer(null)
    setConnectionState('DISCONNECTED')
  }

  const { propertyTree, uniqueServices } = useMemo(() => {
    const propertyTree = {}
    for (const component of components) {
      if (propertyTree[component.serviceUuid] === undefined) {
        propertyTree[component.serviceUuid] = []
      }
      propertyTree[component.serviceUuid].push(component.characteristicUuid)
    }
    return { propertyTree, uniqueServices: Object.keys(propertyTree) }
  }, [JSON.stringify(components)])

  const parseCharacteristics = async (server) => {
    const remoteGattServices = []
    for (const serviceId of uniqueServices) {
      try {
        const gattService = await server.getPrimaryService(serviceId)
        const relevantComponent = components.find(c => c.serviceUuid === serviceId)
        relevantComponent.bluetoothProperties.gattService = gattService
        updateComponent(relevantComponent)
        remoteGattServices.push(gattService)
      } catch (e) {
        const relevantComponent = components.find(c => c.serviceUuid === serviceId)
        relevantComponent.bluetoothProperties.state = 'SERVICE_NOT_FOUND'
        updateComponent(relevantComponent)
      }
    }
    for (const remoteGattService of remoteGattServices) {
      const characteristicsIds = propertyTree[remoteGattService.uuid]
      for (const characteristicId of characteristicsIds) {
        try {
          const remoteGattCharacteristic = await remoteGattService.getCharacteristic(characteristicId)
          const relevantComponent = components.find(c => c.characteristicUuid === characteristicId)
          relevantComponent.bluetoothProperties.state = 'CONNECTED'
          relevantComponent.bluetoothProperties.gattCharacteristic = remoteGattCharacteristic
          updateComponent(relevantComponent)
        } catch (e) {
          const relevantComponent = components.find(c => c.characteristicUuid === characteristicId)
          relevantComponent.bluetoothProperties.state = 'CHARACTERISTIC_NOT_FOUND'
          updateComponent(relevantComponent)
        }
      }
    }
  }

  const connectToDevice = async () => {
    try {
      let connectionParams = { optionalServices: uniqueServices }
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
