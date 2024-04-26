import React, { useState } from 'react'
import { useComponents } from '../../hooks/useComponents'
import OutlineButton from '../ui/OutlineButton'
import SolidButton from '../ui/SolidButton'
import TextInput from '../ui/TextInput'
import CharacteristicPropertyCheckbox from '../ui/CharacteristicPropertyCheckbox'
import NumberInput from '../ui/NumberInput'
import ModalContainer from './ModalContainer'
import ModalButtonContainer from './ModalButtonContainer'
import { nanoid } from 'nanoid'

const AddSliderComponentModal = ({ newComponentType }) => {
  const { addComponent } = useComponents()

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

  const resetState = () => {
    setIsRead(false)
    setIsWrite(false)
    setIsNotify(false)

    setComponentLabel('')
    setServiceUuid('')
    setCharacteristicUuid('')
  }

  const handleAddComponent = () => {
    const newComponent = {
      id: nanoid(),
      type: newComponentType.type,
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
    document.getElementById('add_slider_component_modal').close()
    resetState()
  }

  const propertyComponents = {
    READ: (
      <CharacteristicPropertyCheckbox
        key='read'
        title='Read'
        description='Read a value from your peripheral device'
        checked={isRead}
        onChange={() => setIsRead((prev) => !prev)}
      />
    ),
    WRITE: (
      <CharacteristicPropertyCheckbox
        key='write'
        title='Write'
        description='Write a value to your peripheral device'
        checked={isWrite}
        onChange={() => setIsWrite((prev) => !prev)}
      />
    ),
    NOTIFY: (
      <CharacteristicPropertyCheckbox
        key='notify'
        title='Notify'
        description='Listen to changes of a value on your peripheral device'
        checked={isNotify}
        onChange={() => setIsNotify((prev) => !prev)}
      />
    )
  }

  return (
    <ModalContainer modalId='add_slider_component_modal' modalTitle={`Configure ${newComponentType?.title} Component`}>
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

      <div className='mt-4'>
        <label className='block'>
          <span>Payload size</span>
          <select className='border w-full py-2 px-3 text-gray-700 focus:outline-none focus:border-black'>
            <option value='8_BIT'>8 bit</option>
            <option value='16_BIT'>16 bit</option>
            <option value='32_BIT'>32 bit</option>
          </select>
        </label>
      </div>

      <div className='flex flex-col mt-4 space-y-2'>
        {newComponentType?.availableProperties?.map(prop => propertyComponents[prop])}
      </div>

      <ModalButtonContainer>
        <OutlineButton
          onClick={() => document.getElementById('add_slider_component_modal').close()}
        >
          Cancel
        </OutlineButton>

        <SolidButton
          onClick={handleAddComponent}
          disabled={noPropsSelected || missingUuid || badValues}
        >
          Add
        </SolidButton>
      </ModalButtonContainer>
    </ModalContainer>
  )
}

export default AddSliderComponentModal
