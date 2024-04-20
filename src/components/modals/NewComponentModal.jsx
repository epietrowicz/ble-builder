import React, { useState } from 'react'
import { useComponentsContext } from '../../hooks/useComponents'
import TextInput from '../ui/TextInput'
import OutlineButton from '../ui/OutlineButton'
import SolidButton from '../ui/SolidButton'
import CharacteristicPropertyCheckbox from '../ui/CharacteristicPropertyCheckbox'

const NewComponentModal = ({ newComponentType }) => {
  const { addComponent } = useComponentsContext()

  const [isRead, setIsRead] = useState(false)
  const [isWrite, setIsWrite] = useState(false)
  const [isNotify, setIsNotify] = useState(false)

  const [componentLabel, setComponentLabel] = useState('')
  const [serviceUuid, setServiceUuid] = useState('')
  const [characteristicUuid, setCharacteristicUuid] = useState('')

  const noPropsSelected = isRead === false && isWrite === false && isNotify === false
  const missingUuid = serviceUuid === '' || characteristicUuid === '' || componentLabel === ''

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
      componentTypeId: newComponentType.id,
      componentType: newComponentType.type,
      componentLabel,
      serviceUuid,
      characteristicUuid,
      properties: {
        read: isRead,
        write: isWrite,
        notify: isNotify
      },
      sliderProperties: {
        min: 0,
        max: 100,
        step: 1
      }
    }
    addComponent(newComponent)
    document.getElementById('new_component_modal').close()
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
    <dialog id='new_component_modal' className='border p-6 min-w-96'>
      <h2 className='font-semibold text-xl mb-4'>Configure {newComponentType?.title} Component</h2>
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

      <div className='flex flex-col mt-4 space-y-2'>
        {newComponentType?.availableProperties?.map(prop => propertyComponents[prop])}
      </div>

      <div className='mt-8 flex items-center justify-end space-x-2'>
        <OutlineButton
          text='Cancel'
          onClick={() => document.getElementById('new_component_modal').close()}
        />

        <SolidButton
          text='Add'
          onClick={handleAddComponent}
          disabled={noPropsSelected || missingUuid}
        />
      </div>
    </dialog>
  )
}

export default NewComponentModal
