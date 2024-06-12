import { useState, useEffect } from 'react'

const useIncomingBluetoothData = (characteristic, readValue, notifyEventChange, dependencies) => {
  const [notificationsStarted, setNotificationsStarted] = useState(false)

  useEffect(() => {
    try {
      if (characteristic !== null) {
        if (characteristic?.properties?.read) {
          readValue()
        }
        if (characteristic?.properties?.notify && !notificationsStarted) {
          console.log('starting notifications!')
          characteristic.startNotifications()
          characteristic.addEventListener('characteristicvaluechanged', notifyEventChange)
          setNotificationsStarted(true)
        }
      }
    } catch (e) {
      console.log(e)
    }
  }, dependencies)
}

export default useIncomingBluetoothData
