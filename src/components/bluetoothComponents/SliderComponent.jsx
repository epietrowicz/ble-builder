import React, { useEffect, useState } from 'react'
import BluetoothComponentContainer from './BluetoothComponentContainer'
import { useComponents } from '../../hooks/useComponents'

const SliderComponent = ({ bleComponent }) => {
  const { setFocusedComponent } = useComponents()
  const [sliderValue, setSliderValue] = useState(bleComponent?.sliderProperties?.value)

  const readValue = async (gattCharacteristic) => {
    const result = await gattCharacteristic.readValue()
    const value = result.getInt8(0)
    console.log(value)
    setSliderValue(value)
  }

  const notifyEventChange = (e) => {
    const value = e.target.value.getInt8(0)
    console.log(value)
    setSliderValue(value)
  }

  useEffect(() => {
    setSliderValue(bleComponent?.sliderProperties?.value)
    if (bleComponent.bluetoothProperties.gattCharacteristic !== null) {
      const characteristic = bleComponent.bluetoothProperties.gattCharacteristic
      if (bleComponent.bluetoothProperties.read) {
        readValue(characteristic)
      }
      if (bleComponent.bluetoothProperties.notify) {
        characteristic.startNotifications()
        characteristic.addEventListener('characteristicvaluechanged', notifyEventChange)
      }
    }
  }, [JSON.stringify(bleComponent)])

  const handleValueChange = async (e) => {
    try {
      const val = e.target.value
      setSliderValue(val)
      if (bleComponent.bluetoothProperties.gattCharacteristic !== null && bleComponent.bluetoothProperties.write) {
        const encoder = new TextEncoder('utf-8')
        await bleComponent.bluetoothProperties.gattCharacteristic.writeValueWithResponse(encoder.encode(val))
      }
    } catch (e) {
      console.log(e)
    }
  }

  const handleEditComponent = () => {
    setFocusedComponent(bleComponent)
    document.getElementById('add_slider_component_modal').showModal()
  }

  return (
    <BluetoothComponentContainer component={bleComponent} onEdit={handleEditComponent}>
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
