import React from 'react'
import { useComponents } from '../../hooks/useComponents'
import SolidButton from '../ui/SolidButton'
import BluetoothComponentContainer from './BluetoothComponentContainer'
import { numberToUint8Array, writeToCharacteristic } from '../../lib/bleUtils'

const ButtonComponent = ({ component }) => {
  const { setFocusedComponent } = useComponents()

  const buttonDisabled = component.bluetoothProperties.state === 'DISCONNECTED'
  const characteristic = component?.bluetoothProperties?.gattCharacteristic ?? null

  const handleEditComponent = () => {
    setFocusedComponent(component)
    document.getElementById('add_button_component_modal').showModal()
  }

  const onClick = async () => {
    const valueToWrite = component.buttonProperties.valueToWrite
    const encodedValue = numberToUint8Array(valueToWrite)
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
      <SolidButton
        onClick={onClick}
        disabled={buttonDisabled}
        additionalClasses='w-full flex items-center justify-center'
      >
        {btnLabel}
      </SolidButton>
    </BluetoothComponentContainer>
  )
}

export default ButtonComponent
