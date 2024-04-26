import React, { useState, useContext, createContext, useEffect, useCallback } from 'react'
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
  const { components, setComponentState, updateComponentProperty, updateComponentBluetoothProperty } = useComponents()
  const [connectionState, setConnectionState] = useState('DISCONNECTED')
  const [device, setDevice] = useState(null)
  const [gattServer, setGattServer] = useState(null)
  // const [gattServices, setGattServices] = useState([])
  // const [gattCharacteristics, setGattCharacteristics] = useState([])
  const [error, setError] = useState(null)
  const [scanFilter, setScanFilter] = useState('')

  useEffect(() => {
    if (device === null) {
      for (const component of components) {
        updateComponentBluetoothProperty(component, 'state', 'DISCONNECTED')
        updateComponentBluetoothProperty(component, 'gattCharacteristic', null)
        updateComponentBluetoothProperty(component, 'gattService', null)
      }
      setConnectionState('DISCONNECTED')
    }
  }, [device])

  const disconnectDevice = () => {
    console.log('Disconnected!')

    if (device && device.gatt.connected) {
      device.gatt.disconnect()
    }

    setDevice(null)
    setGattServer(null)
    setConnectionState('DISCONNECTED')
  }

  const notifyEventChange = (e) => {
    const characteristicUuid = e.target.uuid
    const value = e.target.value.getInt8(0)
    const relevantComponent = components.find(c => c.characteristicUuid === characteristicUuid)
    updateComponentProperty(relevantComponent, 'value', value)
  }

  const buildPropertyTree = () => {
    const propertyTree = {}
    for (const component of components) {
      if (propertyTree[component.serviceUuid] === undefined) {
        propertyTree[component.serviceUuid] = {}
      }
      propertyTree[component.serviceUuid][component.characteristicUuid] = {
        read: component.bluetoothProperties.read,
        write: component.bluetoothProperties.write,
        notify: component.bluetoothProperties.notify
      }
    }
    return propertyTree
  }

  const connectToDevice = async () => {
    try {
      const propertyTree = buildPropertyTree()
      const uniqueServices = Object.keys(propertyTree)

      let connectionParams = { optionalServices: uniqueServices }
      if (scanFilter === '') {
        connectionParams = { ...connectionParams, acceptAllDevices: true }
      } else {
        connectionParams = { ...connectionParams, filters: [{ namePrefix: scanFilter }] }
      }

      const device = await navigator.bluetooth.requestDevice(connectionParams)

      device.addEventListener('gattserverdisconnected', disconnectDevice)
      const server = await device.gatt.connect()

      const remoteGattServices = []
      const remoteGattCharacteristics = []

      for (const serviceId of uniqueServices) {
        const relevantComponent = components.find(c => c.serviceUuid === serviceId)
        try {
          const gattService = await server.getPrimaryService(serviceId)
          updateComponentBluetoothProperty(relevantComponent, 'gattService', gattService)
          remoteGattServices.push(gattService)
        } catch (e) {
          updateComponentBluetoothProperty(relevantComponent, 'state', 'SERVICE_NOT_FOUND')
        }
      }

      for (const remoteGattService of remoteGattServices) {
        const characteristicsIds = Object.keys(propertyTree[remoteGattService.uuid])
        for (const characteristicId of characteristicsIds) {
          const relevantComponent = components.find(c => c.characteristicUuid === characteristicId)
          try {
            const remoteGattCharacteristic = await remoteGattService.getCharacteristic(characteristicId)
            const properties = propertyTree[remoteGattService.uuid][characteristicId]
            if (properties.notify) {
              remoteGattCharacteristic.startNotifications()
              remoteGattCharacteristic.addEventListener('characteristicvaluechanged', notifyEventChange)
            }
            if (properties.read) {
              const result = await remoteGattCharacteristic.readValue()
              const value = result.getInt8(0)
              updateComponentProperty(relevantComponent, 'value', value)
            }
            if (properties.write) {
              updateComponentBluetoothProperty(relevantComponent, 'gattCharacteristic', remoteGattCharacteristic)
            }
            updateComponentBluetoothProperty(relevantComponent, 'state', 'CONNECTED')
            remoteGattCharacteristics.push(remoteGattCharacteristic)
          } catch (e) {
            updateComponentBluetoothProperty(relevantComponent, 'state', 'CHARACTERISTIC_NOT_FOUND')
          }
        }
        // setGattCharacteristics(remoteGattCharacteristics)
      }
      // const gattService = await server.getPrimaryServices('bc30cc49-7b50-42c4-8dbb-68d6c3155425')
      // const res = await gattService.getCharacteristic('bc30cc51-7b50-42c4-8dbb-68d6c3155425')
      // console.log(res)
      // console.log(availableServices)
      // console.log(propertyTree)
      // for (const gattService of gattServices) {
      // const serviceId = availableService?.uuid
      // const gattService = await server.getPrimaryService(serviceId)
      // const res = await gattService.getCharacteristic('bc30cc51-7b50-42c4-8dbb-68d6c3155425')
      // console.log(res)
      // console.log(gattService)
      // const isServiceDefined = propertyTree[serviceId] !== undefined
      // if (isServiceDefined) {
      //   remoteGattServices.push(gattService)
      //   const res = await gattService.getCharacteristic('bc30cc51-7b50-42c4-8dbb-68d6c3155425')
      //   console.log(res)
      //   const characteristics = Object.keys(propertyTree[serviceId])
      // console.log(characteristics)
      // for (const characteristicId of characteristics) {
      //   console.log(characteristicId)
      // const gattCharacteristic = await gattService.getCharacteristic(characteristicId)
      // const properties = propertyTree[serviceId][characteristicId]
      // console.log(properties)
      // if (properties.notify) {
      //   gattCharacteristic.startNotifications()
      //   gattCharacteristic.addEventListener('characteristicvaluechanged', notifyEventChange)
      // }
      // if (properties.read) {
      //   const result = gattCharacteristic.readValue()
      //   console.log(result)
      //   // TODO: Read a value
      // }
      // remoteGattCharacteristics.push(gattCharacteristic)
      // }
      // }
      // }
      console.log('here')
      // setGattCharacteristics(remoteGattCharacteristics)
      //
      // const service = await server.getPrimaryService(services[0])
      // const char = await service.getCharacteristic(characteristics[0])
      // char.startNotifications()
      // char.addEventListener('characteristicvaluechanged', notifyEventChange)

      // for (const uuid of services) {
      //   const service = await server.getPrimaryService(uuid)
      //   const char = await service.getCharacteristic(characteristics[0])
      //   setAllServices(prev => [...prev, service])
      // }

      // console.log(allServices)
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
