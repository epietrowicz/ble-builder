import React, { useState } from 'react'
import BluetoothComponentContainer from './BluetoothComponentContainer'
import { useComponents } from '../../hooks/useComponents'
import { parseIncomingValue, writeToCharacteristic } from '../../lib/bleUtils'
import useIncomingBluetoothData from '../../hooks/useIncomingBluetoothData'

const ToggleComponent = ({ component }) => {
  const { setFocusedComponent } = useComponents()
  const [toggleValue, setToggleValue] = useState(true)

  const characteristic = component?.bluetoothProperties?.gattCharacteristic ?? null

  const readValue = async () => {
    const result = await characteristic.readValue()
    const parsedValue = parseIncomingValue(result)
    if (parsedValue === component.toggleProperties.onValue) {
      setToggleValue(true)
    } else if (parsedValue === component.toggleProperties.offValue) {
      setToggleValue(false)
    }
  }

  const notifyEventChange = (e) => {
    const result = e.target.value
    const parsedValue = parseIncomingValue(result)
    if (parsedValue === component.toggleProperties.onValue) {
      setToggleValue(true)
    } else if (parsedValue === component.toggleProperties.offValue) {
      setToggleValue(false)
    }
  }

  useIncomingBluetoothData(
    characteristic,
    readValue,
    notifyEventChange,
    [JSON.stringify(component)])

  const handleValueChange = async () => {
    const encodedValue = toggleValue
      ? new Uint8Array([component.toggleProperties.offValue])
      : new Uint8Array([component.toggleProperties.onValue])
    setToggleValue(!toggleValue)
    await writeToCharacteristic(encodedValue, characteristic)
  }

  const handleEditComponent = () => {
    setFocusedComponent(component)
    document.getElementById('add_toggle_component_modal').showModal()
  }

  const handleReadValue = async () => {
    const characteristic = component.bluetoothProperties.gattCharacteristic
    if (characteristic !== null) {
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
          checked={toggleValue}
          onChange={handleValueChange}
          className='sr-only peer'
        />
        <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600" />
      </label>

    </BluetoothComponentContainer>
  )
}

export default ToggleComponent
