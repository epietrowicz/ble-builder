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

const AddSliderComponentModal = () => {
  const { addComponent, focusedComponent, setFocusedComponent, updateComponent } = useComponents()

  const [isRead, setIsRead] = useState(false)
  const [isWrite, setIsWrite] = useState(false)
  const [isNotify, setIsNotify] = useState(false)

  const [componentLabel, setComponentLabel] = useState('')
  const [serviceUuid, setServiceUuid] = useState('')
  const [characteristicUuid, setCharacteristicUuid] = useState('')

  const [minValue, setMinValue] = useState(0)
  const [maxValue, setMaxValue] = useState(100)
  const [step, setStep] = useState(1)

  const noPropsSelected = isRead === false && isWrite === false && isNotify === false
  const missingUuid = serviceUuid === '' || characteristicUuid === '' || componentLabel === ''
  const badValues = minValue >= maxValue || step === 0

  useEffect(() => {
    if (focusedComponent !== null) {
      setIsRead(focusedComponent.bluetoothProperties.read)
      setIsWrite(focusedComponent.bluetoothProperties.write)
      setIsNotify(focusedComponent.bluetoothProperties.notify)
      setComponentLabel(focusedComponent.componentLabel)
      setServiceUuid(focusedComponent.serviceUuid)
      setCharacteristicUuid(focusedComponent.characteristicUuid)
      setMinValue(focusedComponent.sliderProperties.min)
      setMaxValue(focusedComponent.sliderProperties.max)
      setStep(focusedComponent.sliderProperties.step)
    }
  }, [focusedComponent])

  const resetState = () => {
    setIsRead(false)
    setIsWrite(false)
    setIsNotify(false)

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
        serviceUuid,
        characteristicUuid,
        bluetoothProperties: {
          state: 'DISCONNECTED',
          gattService: null,
          gattCharacteristic: null,
          read: isRead,
          write: isWrite,
          notify: isNotify
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
      focusedComponent.bluetoothProperties.read = isRead
      focusedComponent.bluetoothProperties.write = isWrite
      focusedComponent.bluetoothProperties.notify = isNotify
      focusedComponent.componentLabel = componentLabel
      focusedComponent.serviceUuid = serviceUuid
      focusedComponent.characteristicUuid = characteristicUuid
      focusedComponent.sliderProperties.min = minValue
      focusedComponent.sliderProperties.max = maxValue
      focusedComponent.sliderProperties.step = step
      updateComponent(focusedComponent)
      setFocusedComponent(null)
    }
    document.getElementById('add_slider_component_modal').close()
    resetState()
  }

  const handleCancel = () => {
    document.getElementById('add_slider_component_modal').close()
    setFocusedComponent(null)
    resetState()
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

      <div className='flex flex-col mt-4 space-y-2'>
        <CharacteristicPropertyCheckbox
          key='read'
          title='Read'
          description='Read a value from your peripheral device'
          checked={isRead}
          onChange={() => setIsRead((prev) => !prev)}
        />
        <CharacteristicPropertyCheckbox
          key='write'
          title='Write'
          description='Write a value to your peripheral device'
          checked={isWrite}
          onChange={() => setIsWrite((prev) => !prev)}
        />

        <CharacteristicPropertyCheckbox
          key='notify'
          title='Notify'
          description='Listen to changes of a value on your peripheral device'
          checked={isNotify}
          onChange={() => setIsNotify((prev) => !prev)}
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
          disabled={noPropsSelected || missingUuid || badValues}
        >
          {focusedComponent === null ? 'Add' : 'Update'}
        </SolidButton>
      </ModalButtonContainer>
    </ModalContainer>
  )
}

export default AddSliderComponentModal
