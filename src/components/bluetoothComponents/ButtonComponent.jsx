import React, { useState } from 'react'
import { useComponents } from '../../hooks/useComponents'
import SolidButton from '../ui/SolidButton'
import BluetoothComponentContainer from './BluetoothComponentContainer'
import { CloudUpload } from 'lucide-react'

const ButtonComponent = ({ component }) => {
  const { setFocusedComponent } = useComponents()
  const [loading, setLoading] = useState(false)

  const buttonDisabled = component.bluetoothProperties.state === 'DISCONNECTED'

  const handleEditComponent = () => {
    setFocusedComponent(component)
    document.getElementById('add_button_component_modal').showModal()
  }

  const onClick = async () => {
    try {
      setLoading(true)
      const valueToWrite = component.buttonProperties.valueToWrite
      if (component.bluetoothProperties.gattCharacteristic !== null && component.bluetoothProperties.write) {
        const encodedValue = new Uint8Array([valueToWrite])
        await component.bluetoothProperties.gattCharacteristic.writeValueWithResponse(encodedValue)
      }
    } catch (e) {
      console.log(e)
    } finally {
      setLoading(false)
    }
  }
  return (
    <BluetoothComponentContainer
      component={component}
      onEdit={handleEditComponent}
    >
      <SolidButton
        onClick={onClick}
        disabled={buttonDisabled}
        loading={loading}
        additionalClasses='w-full flex items-center justify-center'
      >
        <CloudUpload className='h-5 w-5' />
      </SolidButton>
    </BluetoothComponentContainer>
  )
}

export default ButtonComponent
