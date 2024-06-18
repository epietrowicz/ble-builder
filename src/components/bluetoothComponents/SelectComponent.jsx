import React, { useState } from 'react'
import { useComponents } from '../../hooks/useComponents'
import BluetoothComponentContainer from './BluetoothComponentContainer'
import { numberToUint8Array, parseIncomingValue, writeToCharacteristic } from '../../lib/bleUtils'
import useIncomingBluetoothData from '../../hooks/useIncomingBluetoothData'
import { useBluetooth } from '../../hooks/useBluetooth'
import StyledSelect from '../ui/StyledSelect'

const SelectComponent = ({ component }) => {
  const { setFocusedComponent } = useComponents()
  const { setError } = useBluetooth()
  const [selectedOption, setSelectOption] = useState(component.selectProperties[0].value)
  const characteristic = component?.bluetoothProperties?.gattCharacteristic ?? null

  const updateValue = (result) => {
    const parsedValue = parseIncomingValue(result)
    const incoming = component.selectProperties.find(option => parseInt(option.value) === parsedValue) ?? null
    if (incoming !== null) {
      setSelectOption(incoming.value)
    } else {
      setError({ message: 'Invalid value received from device for a select component' })
    }
  }

  const readValue = async () => {
    const result = await characteristic.readValue()
    updateValue(result)
  }

  const notifyEventChange = (e) => {
    console.log('notify!')
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
    document.getElementById('add_select_component_modal').showModal()
  }

  const handleChange = async (e) => {
    const valueToWrite = e.target.value
    setSelectOption(valueToWrite)
    const encodedValue = numberToUint8Array(valueToWrite)
    await writeToCharacteristic(encodedValue, characteristic)
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
      <StyledSelect
        value={selectedOption}
        onChange={handleChange}
        options={component.selectProperties}
      />
    </BluetoothComponentContainer>
  )
}

export default SelectComponent
