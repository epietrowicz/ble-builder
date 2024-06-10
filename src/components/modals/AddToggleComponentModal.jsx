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

const AddToggleComponentModal = () => {
  const { addComponent, focusedComponent, setFocusedComponent, updateComponent } = useComponents()

  const [componentLabel, setComponentLabel] = useState('')
  const [serviceUuid, setServiceUuid] = useState('')
  const [characteristicUuid, setCharacteristicUuid] = useState('')

  const [onValue, setOnValue] = useState(1)
  const [offValue, setOffValue] = useState(0)

  const missingUuid = serviceUuid === '' || characteristicUuid === '' || componentLabel === ''
  const badValues = onValue === offValue

  useEffect(() => {
    if (focusedComponent !== null && focusedComponent.type === 'TOGGLE') {
      setComponentLabel(focusedComponent.componentLabel)
      setServiceUuid(focusedComponent.serviceUuid)
      setCharacteristicUuid(focusedComponent.characteristicUuid)
      setOffValue(focusedComponent.toggleProperties.offValue)
      setOnValue(focusedComponent.toggleProperties.onValue)
    }
  }, [focusedComponent])

  const resetState = () => {
    setComponentLabel('')
    setServiceUuid('')
    setCharacteristicUuid('')
    setOnValue(1)
    setOffValue(0)
  }

  const handleAddComponent = () => {
    if (focusedComponent === null) {
      const newComponent = {
        id: nanoid(),
        type: 'TOGGLE',
        componentLabel,
        serviceUuid: serviceUuid.toLowerCase(),
        characteristicUuid: characteristicUuid.toLowerCase(),
        bluetoothProperties: {
          state: 'DISCONNECTED',
          gattService: null,
          gattCharacteristic: null
        },
        toggleProperties: {
          onValue,
          offValue
        }
      }
      addComponent(newComponent)
    } else {
      focusedComponent.componentLabel = componentLabel
      focusedComponent.serviceUuid = serviceUuid.toLowerCase()
      focusedComponent.characteristicUuid = characteristicUuid.toLowerCase()
      focusedComponent.toggleProperties.min = onValue
      focusedComponent.toggleProperties.max = offValue
      updateComponent(focusedComponent)

      updateComponent(focusedComponent)
      setFocusedComponent(null)
    }
    document.getElementById('add_toggle_component_modal').close()
    resetState()
    track('Added toggle | BLE Builder')
  }

  const handleCancel = () => {
    document.getElementById('add_toggle_component_modal').close()
    setFocusedComponent(null)
    resetState()
    track('Canceled toggle | BLE Builder')
  }

  return (
    <ModalContainer modalId='add_toggle_component_modal' modalTitle='Configure Toggle Component'>
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

      <div className='flex items-center space-x-2 mt-4'>
        <NumberInput
          label='Off value'
          value={offValue}
          onChange={e => setOffValue(e.target.value)}
        />
        <NumberInput
          label='On value'
          value={onValue}
          onChange={e => onValue(e.target.value)}
        />
      </div>

      <div className='mt-6'>
        <CharacteristicProperties isRead isWrite isNotify />
      </div>

      <ModalButtonContainer>
        <OutlineButton
          onClick={handleCancel}
        >
          Cancel
        </OutlineButton>

        <SolidButton
          onClick={handleAddComponent}
          disabled={missingUuid || badValues}
        >
          {focusedComponent === null ? 'Add' : 'Update'}
        </SolidButton>
      </ModalButtonContainer>
    </ModalContainer>
  )
}

export default AddToggleComponentModal
