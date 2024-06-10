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

const AddSliderComponentModal = () => {
  const { addComponent, focusedComponent, setFocusedComponent, updateComponent } = useComponents()

  const [componentLabel, setComponentLabel] = useState('')
  const [serviceUuid, setServiceUuid] = useState('')
  const [characteristicUuid, setCharacteristicUuid] = useState('')

  const [minValue, setMinValue] = useState(0)
  const [maxValue, setMaxValue] = useState(100)
  const [step, setStep] = useState(1)

  const missingUuid = serviceUuid === '' || characteristicUuid === '' || componentLabel === ''
  const badValues = minValue >= maxValue || step === 0

  useEffect(() => {
    if (focusedComponent !== null && focusedComponent.type === 'SLIDER') {
      setComponentLabel(focusedComponent.componentLabel)
      setServiceUuid(focusedComponent.serviceUuid)
      setCharacteristicUuid(focusedComponent.characteristicUuid)
      setMinValue(focusedComponent.sliderProperties.min)
      setMaxValue(focusedComponent.sliderProperties.max)
      setStep(focusedComponent.sliderProperties.step)
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
        type: 'SLIDER',
        componentLabel,
        serviceUuid: serviceUuid.toLowerCase(),
        characteristicUuid: characteristicUuid.toLowerCase(),
        bluetoothProperties: {
          state: 'DISCONNECTED',
          gattService: null,
          gattCharacteristic: null
        },
        sliderProperties: {
          min: minValue,
          max: maxValue,
          step,
          value: Math.ceil((maxValue - minValue) / 2)
        }
      }
      addComponent(newComponent)
    } else {
      focusedComponent.componentLabel = componentLabel
      focusedComponent.serviceUuid = serviceUuid.toLowerCase()
      focusedComponent.characteristicUuid = characteristicUuid.toLowerCase()
      focusedComponent.sliderProperties.min = minValue
      focusedComponent.sliderProperties.max = maxValue
      focusedComponent.sliderProperties.step = step
      updateComponent(focusedComponent)
      setFocusedComponent(null)
    }
    document.getElementById('add_slider_component_modal').close()
    resetState()
    track('Added slider | BLE Builder')
  }

  const handleCancel = () => {
    document.getElementById('add_slider_component_modal').close()
    setFocusedComponent(null)
    resetState()
    track('Canceled slider | BLE Builder')
  }

  return (
    <ModalContainer modalId='add_slider_component_modal' modalTitle='Configure Slider Component'>
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
          label='Min value'
          value={minValue}
          onChange={e => setMinValue(e.target.value)}
        />
        <NumberInput
          label='Max value'
          value={maxValue}
          onChange={e => setMaxValue(e.target.value)}
        />
        <NumberInput
          label='Step'
          value={step}
          onChange={e => setStep(e.target.value)}
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

export default AddSliderComponentModal
