import React, { useState } from 'react'
import { useComponents } from '../../hooks/useComponents'
import SolidButton from '../ui/SolidButton'
import BluetoothComponentContainer from './BluetoothComponentContainer'
import { numberToUint8Array, writeToCharacteristic } from '../../lib/bleUtils'
import TextInput from '../ui/TextInput'
import StyledSelect from '../ui/StyledSelect'

const RawValueComponent = ({ component }) => {
  const dataTypeOptions = ['HEXADECIMAL', 'DECIMAL', 'BINARY']

  const [value, setValue] = useState('')
  const [dataType, setDataType] = useState(dataTypeOptions[0])

  const { setFocusedComponent } = useComponents()

  const buttonDisabled = component.bluetoothProperties.state === 'DISCONNECTED'
  const characteristic = component?.bluetoothProperties?.gattCharacteristic ?? null

  const handleEditComponent = () => {
    setFocusedComponent(component)
    document.getElementById('add_raw_component_modal').showModal()
  }

  const onClick = async () => {
    let parsedValue
    switch (dataType) {
      case 'HEXADECIMAL':
        parsedValue = parseInt(value, 16)
        break
      case 'DECIMAL':
        parsedValue = parseInt(value, 10)
        break
      case 'BINARY':
        parsedValue = parseInt(value, 2)
        break
    }
    const encodedValue = numberToUint8Array(parsedValue)
    await writeToCharacteristic(encodedValue, characteristic)
  }

  const btnLabel = component?.buttonProperties?.buttonLabel === ''
    ? 'Send'
    : component?.buttonProperties?.buttonLabel

  return (
    <BluetoothComponentContainer
      component={component}
      onEdit={handleEditComponent}
    >
      <StyledSelect
        value={dataType}
        onChange={e => setDataType(e.target.value)}
        options={dataTypeOptions.map((option, index) => ({
          id: index,
          value: option,
          label: option.toLowerCase()
        }))}
      />
      <TextInput
        value={value}
        onChange={e => setValue(e.target.value)}
        placeholder='Enter a value'
        additionalClasses='mt-2'
      />
      <SolidButton
        onClick={onClick}
        disabled={buttonDisabled}
        additionalClasses='w-full flex items-center justify-center mt-4'
      >
        {btnLabel}
      </SolidButton>
    </BluetoothComponentContainer>
  )
}

export default RawValueComponent
