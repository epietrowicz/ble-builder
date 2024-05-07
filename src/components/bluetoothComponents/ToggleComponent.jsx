import React, { useEffect, useState } from 'react'
import BluetoothComponentContainer from './BluetoothComponentContainer'
import { useComponents } from '../../hooks/useComponents'

const ToggleComponent = ({ component }) => {
  const { setFocusedComponent } = useComponents()
  const [toggleValue, setToggleValue] = useState(false)

  const parseIncomingValue = (result) => {
    switch (result.byteLength) {
      case 1:
        return result.getInt8(0)
      case 2:
        return result.getInt16(0)
      case 4:
        return result.getInt32(0)
    }
  }

  const readValue = async (gattCharacteristic) => {
    const result = await gattCharacteristic.readValue()
    const parsedValue = parseIncomingValue(result)
    console.log('Read Value', parsedValue)
    if (parsedValue === component.toggleProperties.onValue) {
      setToggleValue(true)
    } else if (parsedValue === component.toggleProperties.offValue) {
      setToggleValue(false)
    }
  }

  const notifyEventChange = (e) => {
    const result = e.target.value
    const parsedValue = parseIncomingValue(result)
    console.log('Notified Value', parsedValue)
    if (parsedValue === component.toggleProperties.onValue) {
      setToggleValue(true)
    } else if (parsedValue === component.toggleProperties.offValue) {
      setToggleValue(false)
    }
  }

  useEffect(() => {
    try {
      if (component.bluetoothProperties.gattCharacteristic !== null) {
        const characteristic = component.bluetoothProperties.gattCharacteristic
        if (component.bluetoothProperties.read) {
          readValue(characteristic)
        }
        if (component.bluetoothProperties.notify !== null) {
          characteristic.startNotifications()
          characteristic.addEventListener('characteristicvaluechanged', notifyEventChange)
        }
      }
    } catch (e) {
      console.log(e)
    }
  }, [JSON.stringify(component)])

  const handleValueChange = async () => {
    try {
      setToggleValue(prev => !prev)
      if (component.bluetoothProperties.gattCharacteristic !== null && component.bluetoothProperties.write) {
        const encodedValue = toggleValue
          ? new Uint8Array([component.toggleProperties.offValue])
          : new Uint8Array([component.toggleProperties.onValue])
        await component.bluetoothProperties.gattCharacteristic.writeValueWithResponse(encodedValue)
      }
    } catch (e) {
      console.log(e)
    }
  }

  const handleEditComponent = () => {
    setFocusedComponent(component)
    document.getElementById('add_toggle_component_modal').showModal()
  }

  const handleReadValue = async () => {
    const characteristic = component.bluetoothProperties.gattCharacteristic
    if (component.bluetoothProperties.read && characteristic !== null) {
      readValue(characteristic)
    }
  }

  return (
    <BluetoothComponentContainer
      component={component}
      onEdit={handleEditComponent}
      handleReadValue={handleReadValue}
    >

      <label className='inline-flex items-center cursor-pointer'>
        <input
          type='checkbox'
          value={toggleValue}
          onChange={handleValueChange}
          className='sr-only peer'
        />
        <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600" />
      </label>

    </BluetoothComponentContainer>
  )
}

export default ToggleComponent
