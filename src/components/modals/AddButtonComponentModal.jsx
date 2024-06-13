import React, { useState, useEffect } from 'react'
import { useComponents } from '../../hooks/useComponents'
import OutlineButton from '../ui/OutlineButton'
import SolidButton from '../ui/SolidButton'
import TextInput from '../ui/TextInput'
import NumberInput from '../ui/NumberInput'
import ModalContainer from './ModalContainer'
import ModalButtonContainer from './ModalButtonContainer'
import { nanoid } from 'nanoid'
import { track } from '../../lib/mixpanel'
import CharacteristicProperties from '../ui/CharacteristicProperties'

const AddButtonComponentModal = () => {
  const { addComponent, focusedComponent, setFocusedComponent, updateComponent } = useComponents()

  const [componentLabel, setComponentLabel] = useState('')
  const [serviceUuid, setServiceUuid] = useState('')
  const [characteristicUuid, setCharacteristicUuid] = useState('')

  const [valueToWrite, setValueToWrite] = useState(0)
  const [buttonLabel, setButtonLabel] = useState('')

  const missingUuid = serviceUuid === '' || characteristicUuid === '' || componentLabel === ''

  useEffect(() => {
    if (focusedComponent !== null && focusedComponent.type === 'BUTTON') {
      setComponentLabel(focusedComponent.componentLabel)
      setServiceUuid(focusedComponent.serviceUuid)
      setCharacteristicUuid(focusedComponent.characteristicUuid)
      setButtonLabel(focusedComponent.buttonProperties.buttonLabel)
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
        type: 'BUTTON',
        componentLabel,
        serviceUuid: serviceUuid.toLowerCase(),
        characteristicUuid: characteristicUuid.toLowerCase(),
        bluetoothProperties: {
          state: 'DISCONNECTED',
          gattService: null,
          gattCharacteristic: null
        },
        buttonProperties: {
          valueToWrite,
          buttonLabel
        }
      }
      addComponent(newComponent)
    } else {
      focusedComponent.componentLabel = componentLabel
      focusedComponent.serviceUuid = serviceUuid.toLowerCase()
      focusedComponent.characteristicUuid = characteristicUuid.toLowerCase()
      focusedComponent.buttonProperties.valueToWrite = valueToWrite
      focusedComponent.buttonProperties.buttonLabel = buttonLabel
      updateComponent(focusedComponent)
      setFocusedComponent(null)
    }
    document.getElementById('add_button_component_modal').close()
    resetState()
    track('Added button | BLE Builder')
  }

  const handleCancel = () => {
    document.getElementById('add_button_component_modal').close()
    setFocusedComponent(null)
    resetState()
    track('Canceled button | BLE Builder')
  }

  return (
    <ModalContainer modalId='add_button_component_modal' modalTitle='Configure Button Component'>
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

      <TextInput
        label='Label'
        placeholder='Button'
        additionalClasses='mt-4'
        value={buttonLabel}
        onChange={e => setButtonLabel(e.target.value)}
      />

      <div className='mt-4'>
        <NumberInput
          label='Value'
          value={valueToWrite}
          onChange={e => setValueToWrite(e.target.value)}
        />
      </div>

      <div className='mt-6'>
        <CharacteristicProperties isWrite />
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

export default AddButtonComponentModal
