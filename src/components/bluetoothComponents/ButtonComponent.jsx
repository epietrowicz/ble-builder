import React, { useState } from 'react'
import { useComponents } from '../../hooks/useComponents'
import SolidButton from '../ui/SolidButton'
import BluetoothComponentContainer from './BluetoothComponentContainer'
import { CloudUpload } from 'lucide-react'
import { writeToCharacteristic } from '../../lib/bleUtils'

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
    const encodedValue = new Uint8Array([valueToWrite])
    await writeToCharacteristic(encodedValue, characteristic)
  }

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
        <CloudUpload className='h-5 w-5' />
      </SolidButton>
    </BluetoothComponentContainer>
  )
}

export default ButtonComponent
