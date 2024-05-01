import React, { useEffect, useState } from 'react'
import BluetoothComponentContainer from './BluetoothComponentContainer'
import { useComponents } from '../../hooks/useComponents'

const SliderComponent = ({ component }) => {
  const { setFocusedComponent } = useComponents()
  const [sliderValue, setSliderValue] = useState(component?.sliderProperties?.value)

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
    setSliderValue(component?.sliderProperties?.value)
    try {
      if (component.bluetoothProperties.gattCharacteristic !== null) {
        const characteristic = component.bluetoothProperties.gattCharacteristic
        if (component.bluetoothProperties.read) {
          readValue(characteristic)
        }
        if (component.bluetoothProperties.notify !== null) {
          characteristic.startNotifications()
          characteristic.addEventListener('characteristicvaluechanged', notifyEventChange)
        }
      }
    } catch (e) {
      console.log(e)
    }
  }, [JSON.stringify(component)])

  const handleValueChange = async (e) => {
    try {
      const val = e.target.value
      setSliderValue(val)
      if (component.bluetoothProperties.gattCharacteristic !== null && component.bluetoothProperties.write) {
        const encodedValue = new Uint8Array([val])
        await component.bluetoothProperties.gattCharacteristic.writeValueWithResponse(encodedValue)
      }
    } catch (e) {
      console.log(e)
    }
  }

  const handleEditComponent = () => {
    setFocusedComponent(component)
    document.getElementById('add_slider_component_modal').showModal()
  }

  const handleReadValue = async () => {
    const characteristic = component.bluetoothProperties.gattCharacteristic
    if (component.bluetoothProperties.read && characteristic !== null) {
      readValue(characteristic)
    }
  }

  return (
    <BluetoothComponentContainer
      component={component}
      onEdit={handleEditComponent}
      handleReadValue={handleReadValue}
    >
      <input
        type='range'
        min={component?.sliderProperties?.min}
        max={component?.sliderProperties?.max}
        step={component?.sliderProperties?.step}
        value={sliderValue}
        disabled={!component?.bluetoothProperties?.write || component.bluetoothProperties.state === 'DISCONNECTED'}
        onChange={e => handleValueChange(e)}
        className='w-full cursor-pointer'
      />
    </BluetoothComponentContainer>
  )
}

export default SliderComponent
