import React, { useEffect, useState } from 'react'
import ModalContainer from './ModalContainer'
import TextInput from '../ui/TextInput'
import CharacteristicProperties from '../ui/CharacteristicProperties'
import ModalButtonContainer from './ModalButtonContainer'
import OutlineButton from '../ui/OutlineButton'
import SolidButton from '../ui/SolidButton'
import { useComponents } from '../../hooks/useComponents'
import { nanoid } from 'nanoid'
import { track } from '../../lib/mixpanel'

const AddTextComponentModal = () => {
  const { addComponent, focusedComponent, setFocusedComponent, updateComponent } = useComponents()
  const [componentLabel, setComponentLabel] = useState('')
  const [serviceUuid, setServiceUuid] = useState('')
  const [characteristicUuid, setCharacteristicUuid] = useState('')

  const missingUuid = serviceUuid === '' || characteristicUuid === '' || componentLabel === ''

  useEffect(() => {
    if (focusedComponent !== null && focusedComponent.type === 'TEXT') {
      setComponentLabel(focusedComponent.componentLabel)
      setServiceUuid(focusedComponent.serviceUuid)
      setCharacteristicUuid(focusedComponent.characteristicUuid)
    }
  }, [JSON.stringify(focusedComponent)])

  const resetState = () => {
    setComponentLabel('')
    setServiceUuid('')
    setCharacteristicUuid('')
  }

  const handleAddComponent = () => {
    if (focusedComponent === null) {
      const newComponent = {
        id: nanoid(),
        type: 'TEXT',
        componentLabel,
        serviceUuid: serviceUuid.toLowerCase(),
        characteristicUuid: characteristicUuid.toLowerCase(),
        bluetoothProperties: {
          state: 'DISCONNECTED',
          gattService: null,
          gattCharacteristic: null
        }
      }
      addComponent(newComponent)
    } else {
      focusedComponent.componentLabel = componentLabel
      focusedComponent.serviceUuid = serviceUuid.toLowerCase()
      focusedComponent.characteristicUuid = characteristicUuid.toLowerCase()
      updateComponent(focusedComponent)
      setFocusedComponent(null)
    }
    document.getElementById('add_text_component_modal').close()
    resetState()
    track('Added text component | BLE Builder')
  }

  const handleCancel = () => {
    document.getElementById('add_text_component_modal').close()
    setFocusedComponent(null)
    resetState()
    track('Canceled text component | BLE Builder')
  }

  return (
    <ModalContainer modalId='add_text_component_modal' modalTitle='Configure Select Component'>
      <TextInput
        label='Component label'
        placeholder='Label'
        value={componentLabel}
        onChange={e => setComponentLabel(e.target.value)}
      />
      <TextInput
        label='Service UUID'
        placeholder='UUID'
        additionalClasses='mt-4'
        value={serviceUuid}
        onChange={e => setServiceUuid(e.target.value)}
      />
      <TextInput
        label='Characteristic UUID'
        placeholder='UUID'
        additionalClasses='mt-4'
        value={characteristicUuid}
        onChange={e => setCharacteristicUuid(e.target.value)}
      />

      <div className='mt-6'>
        <CharacteristicProperties isRead isNotify />
      </div>

      <ModalButtonContainer>
        <OutlineButton
          onClick={handleCancel}
        >
          Cancel
        </OutlineButton>

        <SolidButton
          onClick={handleAddComponent}
          disabled={missingUuid}
        >
          {focusedComponent === null ? 'Add' : 'Update'}
        </SolidButton>
      </ModalButtonContainer>
    </ModalContainer>
  )
}

export default AddTextComponentModal
