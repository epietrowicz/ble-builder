import React, { useState } from 'react'
import BluetoothComponentContainer from './BluetoothComponentContainer'
import { useComponents } from '../../hooks/useComponents'
import { parseIncomingValue } from '../../lib/bleUtils'
import useIncomingBluetoothData from '../../hooks/useIncomingBluetoothData'

const TextComponent = ({ component }) => {
  const { setFocusedComponent } = useComponents()
  const [textValue, setTextValue] = useState(0)

  const characteristic = component?.bluetoothProperties?.gattCharacteristic ?? null

  const updateValue = (result) => {
    const parsedValue = parseIncomingValue(result)
    if (parsedValue !== null || parsedValue !== undefined) {
      setTextValue(parsedValue)
    }
  }

  const readValue = async () => {
    const result = await characteristic.readValue()
    updateValue(result)
  }

  const notifyEventChange = (e) => {
    console.log('here')
    const result = e.target.value
    updateValue(result)
  }

  useIncomingBluetoothData(
    characteristic,
    readValue,
    notifyEventChange,
    [JSON.stringify(component)])

  const handleEditComponent = () => {
    setFocusedComponent(component)
    document.getElementById('add_text_component_modal').showModal()
  }

  const handleReadValue = async () => {
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
      <h2 className='text-lg'>{textValue}</h2>
    </BluetoothComponentContainer>
  )
}

export default TextComponent
