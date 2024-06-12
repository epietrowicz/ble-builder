import React, { useState } from 'react'
import { useComponents } from '../../hooks/useComponents'
import BluetoothComponentContainer from './BluetoothComponentContainer'
import { ChevronDownIcon } from 'lucide-react'
import { parseIncomingValue, writeToCharacteristic } from '../../lib/bleUtils'
import useIncomingBluetoothData from '../../hooks/useIncomingBluetoothData'
import { useBluetooth } from '../../hooks/useBluetooth'

const SelectComponent = ({ component }) => {
  const { setFocusedComponent } = useComponents()
  const { setError } = useBluetooth()
  const [selectedOption, setSelectOption] = useState(component.selectProperties[0].value)
  const characteristic = component?.bluetoothProperties?.gattCharacteristic ?? null

  const updateValue = (result) => {
    const parsedValue = parseIncomingValue(result)
    const incoming = component.selectProperties.find(option => parseInt(option.value) === parsedValue) ?? null
    console.log(incoming)
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
    const encodedValue = new Uint8Array([valueToWrite])
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
      <div className='relative'>
        <select
          className='px-3 py-2 border w-full appearance-none hover:cursor-pointer'
          value={selectedOption}
          onChange={handleChange}
        >
          {component.selectProperties.map(option => (
            <option key={option.id} value={option.value}>
              {option.label}
            </option>
          ))}

        </select>
        <div className='absolute top-1/2 -translate-y-1/2 right-3'>
          <ChevronDownIcon className='h-4 w-4 text-gray-500' />
        </div>
      </div>
      {/* <SolidButton
        onClick={onClick}
        disabled={buttonDisabled}
        additionalClasses='w-full flex items-center justify-center'
      >
        <CloudUpload className='h-5 w-5' />
      </SolidButton> */}
    </BluetoothComponentContainer>
  )
}

export default SelectComponent
