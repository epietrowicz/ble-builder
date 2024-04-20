import React, { useState } from 'react'
import BluetoothComponentContainer from './BluetoothComponentContainer'

const SliderComponent = ({ bleComponent }) => {
  const [sliderValue, setSliderValue] = useState(50)

  return (
    <BluetoothComponentContainer component={bleComponent}>
      <input
        type='range'
        min={bleComponent?.sliderProperties?.min}
        max={bleComponent?.sliderProperties?.max}
        step={bleComponent?.sliderProperties?.step}
        value={sliderValue}
        onChange={e => setSliderValue(e.target.value)}
        className='w-full cursor-pointer'
      />
    </BluetoothComponentContainer>
  )
}

export default SliderComponent
