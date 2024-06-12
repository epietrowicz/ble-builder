import React, { useEffect, useState } from 'react'
import ModalContainer from './ModalContainer'
import TextInput from '../ui/TextInput'
import NumberInput from '../ui/NumberInput'
import CharacteristicProperties from '../ui/CharacteristicProperties'
import ModalButtonContainer from './ModalButtonContainer'
import OutlineButton from '../ui/OutlineButton'
import SolidButton from '../ui/SolidButton'
import { useComponents } from '../../hooks/useComponents'
import { nanoid } from 'nanoid'
import { track } from '../../lib/mixpanel'
import { XIcon } from 'lucide-react'

const AddSelectComponentModal = ({ component }) => {
  const { addComponent, focusedComponent, setFocusedComponent, updateComponent } = useComponents()
  const [componentLabel, setComponentLabel] = useState('')
  const [serviceUuid, setServiceUuid] = useState('')
  const [characteristicUuid, setCharacteristicUuid] = useState('')
  const [newSelectOption, setNewSelectOption] = useState({ label: '', value: '' })

  const [selectOptions, setSelectOptions] = useState([])

  const missingUuid = serviceUuid === '' || characteristicUuid === '' || componentLabel === ''

  useEffect(() => {
    if (focusedComponent !== null && focusedComponent.type === 'SELECT') {
      setComponentLabel(focusedComponent.componentLabel)
      setServiceUuid(focusedComponent.serviceUuid)
      setCharacteristicUuid(focusedComponent.characteristicUuid)
      setSelectOptions(focusedComponent.selectProperties)
    }
  }, [JSON.stringify(focusedComponent)])

  const resetState = () => {
    setComponentLabel('')
    setServiceUuid('')
    setCharacteristicUuid('')
    setSelectOptions([])
    setNewSelectOption({ label: '', value: '' })
  }

  const handleAddComponent = () => {
    if (focusedComponent === null) {
      const newComponent = {
        id: nanoid(),
        type: 'SELECT',
        componentLabel,
        serviceUuid: serviceUuid.toLowerCase(),
        characteristicUuid: characteristicUuid.toLowerCase(),
        bluetoothProperties: {
          state: 'DISCONNECTED',
          gattService: null,
          gattCharacteristic: null
        },
        selectProperties: selectOptions
      }
      addComponent(newComponent)
    } else {
      focusedComponent.componentLabel = componentLabel
      focusedComponent.serviceUuid = serviceUuid.toLowerCase()
      focusedComponent.characteristicUuid = characteristicUuid.toLowerCase()
      focusedComponent.selectProperties = selectOptions
      updateComponent(focusedComponent)
      setFocusedComponent(null)
    }
    document.getElementById('add_select_component_modal').close()
    resetState()
    track('Added button | BLE Builder')
  }

  const handleCancel = () => {
    document.getElementById('add_select_component_modal').close()
    setFocusedComponent(null)
    resetState()
    track('Canceled button | BLE Builder')
  }

  return (
    <ModalContainer modalId='add_select_component_modal' modalTitle='Configure Select Component'>
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

      <div className='flex items-end space-x-2 mt-4'>
        <TextInput
          label='Label'
          placeholder='Light on'
          onChange={e => setNewSelectOption(prev => ({ ...prev, label: e.target.value }))}
          value={newSelectOption.label}
        />
        <NumberInput
          label='Value'
          placeholder='1'
          onChange={e => setNewSelectOption(prev => ({ ...prev, value: e.target.value }))}
          value={newSelectOption.value}
        />
        <SolidButton
          additionalClasses=''
          onClick={() => setSelectOptions(prev => ([...prev, { ...newSelectOption, id: nanoid() }]))}
        >
          Add option
        </SolidButton>
      </div>
      <div className='flex flex-col'>
        {selectOptions.map((option) => (
          <div
            key={option.id}
            className='border py-2 px-3 flex items-center justify-between mt-2'
          >
            <span>
              {option.label} - {option.value}
            </span>
            <button
              onClick={() => setSelectOptions(prev => prev.filter(opt => opt.id !== option.id))}
            >
              <XIcon className='h-4 w-4 text-gray-500' />
            </button>
          </div>
        ))}
      </div>
      {/* <NumberInput
              label='Off value'
              value={offValue}
              onChange={e => setOffValue(e.target.value)}
            />
            <NumberInput
              label='On value'
              value={onValue}
              onChange={e => onValue(e.target.value)}
            /> */}
      {/* </div> */}

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
          disabled={missingUuid || selectOptions.length === 0}
        >
          {focusedComponent === null ? 'Add' : 'Update'}
        </SolidButton>
      </ModalButtonContainer>
    </ModalContainer>
  )
}

export default AddSelectComponentModal
