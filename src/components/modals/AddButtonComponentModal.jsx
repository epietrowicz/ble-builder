import React, { useState, useEffect } from 'react'
import { useComponents } from '../../hooks/useComponents'
import OutlineButton from '../ui/OutlineButton'
import SolidButton from '../ui/SolidButton'
import TextInput from '../ui/TextInput'
import CharacteristicPropertyCheckbox from '../ui/CharacteristicPropertyCheckbox'
import NumberInput from '../ui/NumberInput'
import ModalContainer from './ModalContainer'
import ModalButtonContainer from './ModalButtonContainer'
import { nanoid } from 'nanoid'

const AddButtonComponentModal = () => {
  const { addComponent, focusedComponent, setFocusedComponent, updateComponent } = useComponents()

  const [componentLabel, setComponentLabel] = useState('')
  const [serviceUuid, setServiceUuid] = useState('')
  const [characteristicUuid, setCharacteristicUuid] = useState('')

  const [valueToWrite, setValueToWrite] = useState(0)

  const missingUuid = serviceUuid === '' || characteristicUuid === '' || componentLabel === ''

  useEffect(() => {
    if (focusedComponent !== null) {
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
        type: 'BUTTON',
        componentLabel,
        serviceUuid,
        characteristicUuid,
        bluetoothProperties: {
          state: 'DISCONNECTED',
          gattService: null,
          gattCharacteristic: null,
          write: true
        },
        buttonProperties: {
          valueToWrite
        }
      }
      addComponent(newComponent)
    } else {
      focusedComponent.componentLabel = componentLabel
      focusedComponent.serviceUuid = serviceUuid
      focusedComponent.characteristicUuid = characteristicUuid
      focusedComponent.buttonProperties.valueToWrite = valueToWrite
      updateComponent(focusedComponent)
      setFocusedComponent(null)
    }
    document.getElementById('add_button_component_modal').close()
    resetState()
  }

  const handleCancel = () => {
    document.getElementById('add_button_component_modal').close()
    setFocusedComponent(null)
    resetState()
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

      <div className='mt-4'>
        <NumberInput
          label='Value to Write'
          value={valueToWrite}
          onChange={e => setValueToWrite(e.target.value)}
        />
      </div>

      <div className='mt-4'>
        <CharacteristicPropertyCheckbox
          key='write'
          title='Write'
          description='Write a value to your peripheral device'
          readOnly
          checked
          disabled
        />
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
