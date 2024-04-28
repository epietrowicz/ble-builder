import React, { useEffect, useState } from 'react'
import BluetoothComponentContainer from './BluetoothComponentContainer'
import { useComponents } from '../../hooks/useComponents'

const SliderComponent = ({ bleComponent }) => {
  const { setFocusedComponent } = useComponents()
  const [sliderValue, setSliderValue] = useState(bleComponent?.sliderProperties?.value)

  const parseIncomingValue = (result) => {
    switch (result.byteLength) {
      case 1:
        return result.getInt8(0)
      case 2:
        return result.getInt16(0)
      case 4:
        return result.getInt32(0)
    }
  }

  const readValue = async (gattCharacteristic) => {
    const result = await gattCharacteristic.readValue()
    const parsedValue = parseIncomingValue(result)
    console.log('Read Value', parsedValue)
    setSliderValue(parsedValue)
  }

  const notifyEventChange = (e) => {
    const result = e.target.value
    const parsedValue = parseIncomingValue(result)
    console.log('Notified Value', parsedValue)
    setSliderValue(parsedValue)
  }

  useEffect(() => {
    setSliderValue(bleComponent?.sliderProperties?.value)
    try {
      if (bleComponent.bluetoothProperties.gattCharacteristic !== null) {
        const characteristic = bleComponent.bluetoothProperties.gattCharacteristic
        if (bleComponent.bluetoothProperties.read) {
          readValue(characteristic)
        }
        if (bleComponent.bluetoothProperties.notify !== null) {
          characteristic.startNotifications()
          characteristic.addEventListener('characteristicvaluechanged', notifyEventChange)
        }
      }
    } catch (e) {
      console.log(e)
    }
  }, [JSON.stringify(bleComponent)])

  const handleValueChange = async (e) => {
    try {
      const val = e.target.value
      setSliderValue(val)
      if (bleComponent.bluetoothProperties.gattCharacteristic !== null && bleComponent.bluetoothProperties.write) {
        const encodedValue = new Uint8Array([val])
        await bleComponent.bluetoothProperties.gattCharacteristic.writeValueWithResponse(encodedValue)
      }
    } catch (e) {
      console.log(e)
    }
  }

  const handleEditComponent = () => {
    setFocusedComponent(bleComponent)
    document.getElementById('add_slider_component_modal').showModal()
  }

  const handleReadValue = async () => {
    const characteristic = bleComponent.bluetoothProperties.gattCharacteristic
    if (bleComponent.bluetoothProperties.read && characteristic !== null) {
      readValue(characteristic)
    }
  }

  return (
    <BluetoothComponentContainer
      component={bleComponent}
      onEdit={handleEditComponent}
      handleReadValue={handleReadValue}
    >
      <input
        type='range'
        min={bleComponent?.sliderProperties?.min}
        max={bleComponent?.sliderProperties?.max}
        step={bleComponent?.sliderProperties?.step}
        value={sliderValue}
        disabled={!bleComponent?.bluetoothProperties?.write || bleComponent.bluetoothProperties.state === 'DISCONNECTED'}
        onChange={e => handleValueChange(e)}
        className='w-full cursor-pointer'
      />
    </BluetoothComponentContainer>
  )
}

export default SliderComponent
