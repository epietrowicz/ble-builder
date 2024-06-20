import React, { useState } from 'react'
import { useComponents } from '../../hooks/useComponents'
import SolidButton from '../ui/SolidButton'
import BluetoothComponentContainer from './BluetoothComponentContainer'
import { numberToUint8Array, writeToCharacteristic, dataViewToHex, parseIncomingValue, dataViewToBinary } from '../../lib/bleUtils'
import TextInput from '../ui/TextInput'
import StyledSelect from '../ui/StyledSelect'
import useIncomingBluetoothData from '../../hooks/useIncomingBluetoothData'

const RawValueComponent = ({ component }) => {
  const dataTypeOptions = ['HEXADECIMAL', 'DECIMAL', 'BINARY']

  const [outgoingValue, setOutgoingValue] = useState('')
  const [incomingValue, setIncomingValue] = useState('')
  const [parsedValue, setParsedValue] = useState('')
  const [dataType, setDataType] = useState(dataTypeOptions[0])

  const { setFocusedComponent } = useComponents()

  const buttonDisabled = component.bluetoothProperties.state === 'DISCONNECTED'
  const characteristic = component?.bluetoothProperties?.gattCharacteristic ?? null

  const parseIncoming = (type, val) => {
    setIncomingValue(val)
    switch (type) {
      case 'HEXADECIMAL':
        setParsedValue(dataViewToHex(val))
        break
      case 'DECIMAL':
        setParsedValue(parseIncomingValue(val))
        break
      case 'BINARY':
        setParsedValue(dataViewToBinary(val))
        break
    }
  }

  const readValue = async () => {
    const value = await characteristic.readValue()
    parseIncoming(dataType, value)
  }

  const notifyEventChange = (e) => {
    const result = e.target.value
    parseIncoming(dataType, result)
  }

  useIncomingBluetoothData(
    characteristic,
    readValue,
    notifyEventChange,
    [JSON.stringify(component)])

  const handleEditComponent = () => {
    setFocusedComponent(component)
    document.getElementById('add_raw_component_modal').showModal()
  }

  const onClick = async () => {
    let parsedValue = outgoingValue
    parsedValue = parsedValue.replace('0x', '')
    parsedValue = parsedValue.replace('0b', '')
    switch (dataType) {
      case 'HEXADECIMAL':
        parsedValue = parseInt(parsedValue, 16)
        break
      case 'DECIMAL':
        parsedValue = parseInt(parsedValue, 10)
        break
      case 'BINARY':
        parsedValue = parseInt(parsedValue, 2)
        break
    }
    const encodedValue = numberToUint8Array(parsedValue)
    await writeToCharacteristic(encodedValue, characteristic)
  }

  const btnLabel = component?.buttonProperties?.buttonLabel === ''
    ? 'Send'
    : component?.buttonProperties?.buttonLabel

  const handleChangeDataType = (e) => {
    setDataType(e.target.value)
    parseIncoming(e.target.value, incomingValue)
  }

  return (
    <BluetoothComponentContainer
      component={component}
      onEdit={handleEditComponent}
      handleReadValue={readValue}
    >
      <StyledSelect
        value={dataType}
        onChange={handleChangeDataType}
        options={dataTypeOptions.map((option, index) => ({
          id: index,
          value: option,
          label: option.toLowerCase()
        }))}
      />
      {characteristic?.properties?.read && (
        <div className='mt-2'>
          <label className='mb-1'>Read</label>
          <p className='break-words py-2 px-3 border text-gray-500'>
            {parsedValue}
          </p>
        </div>
      )}
      {(characteristic?.properties?.write || characteristic?.properties?.writeWithoutResponse) && (
        <div className='mt-2'>
          <label className='mb-1'>Write</label>
          <TextInput
            value={outgoingValue}
            onChange={e => setOutgoingValue(e.target.value)}
            placeholder='Enter a value'
          />
          <SolidButton
            onClick={onClick}
            disabled={buttonDisabled}
            additionalClasses='w-full flex items-center justify-center mt-4'
          >
            {btnLabel}
          </SolidButton>
        </div>
      )}
    </BluetoothComponentContainer>
  )
}

export default RawValueComponent
