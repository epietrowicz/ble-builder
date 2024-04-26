import React, { useEffect, useState } from 'react'
import BluetoothComponentContainer from './BluetoothComponentContainer'

const SliderComponent = ({ bleComponent }) => {
  const [sliderValue, setSliderValue] = useState(bleComponent?.sliderProperties?.value)

  useEffect(() => {
    setSliderValue(bleComponent?.sliderProperties?.value)
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

  return (
    <BluetoothComponentContainer component={bleComponent}>
      <input
        type='range'
        min={bleComponent?.sliderProperties?.min}
        max={bleComponent?.sliderProperties?.max}
        step={bleComponent?.sliderProperties?.step}
        value={sliderValue}
        disabled={!bleComponent?.bluetoothProperties?.write}
        onChange={e => handleValueChange(e)}
        className='w-full cursor-pointer'
      />
    </BluetoothComponentContainer>
  )
}

export default SliderComponent
