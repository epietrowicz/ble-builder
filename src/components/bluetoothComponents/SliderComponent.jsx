import React, { useState } from 'react'
import BluetoothComponentContainer from './BluetoothComponentContainer'
import { useComponents } from '../../hooks/useComponents'
import { numberToUint8Array, parseIncomingValue, writeToCharacteristic } from '../../lib/bleUtils'
import useIncomingBluetoothData from '../../hooks/useIncomingBluetoothData'

const SliderComponent = ({ component }) => {
  const { setFocusedComponent } = useComponents()
  const [sliderValue, setSliderValue] = useState(component?.sliderProperties?.value ?? 0)
  const characteristic = component?.bluetoothProperties?.gattCharacteristic ?? null

  const readValue = async () => {
    const value = await characteristic.readValue()
    const parsedValue = parseIncomingValue(value)
    if (parsedValue) setSliderValue(parsedValue)
  }

  const notifyEventChange = (e) => {
    const result = e.target.value
    const parsedValue = parseIncomingValue(result)
    if (parsedValue) setSliderValue(parsedValue)
  }

  useIncomingBluetoothData(
    characteristic,
    readValue,
    notifyEventChange,
    [JSON.stringify(component)])

  const handleValueChange = async (e) => {
    const value = e.target.value
    setSliderValue(value)
    const encodedValue = numberToUint8Array(value)
    await writeToCharacteristic(encodedValue, characteristic)
  }

  const handleEditComponent = () => {
    setFocusedComponent(component)
    document.getElementById('add_slider_component_modal').showModal()
  }

  return (
    <BluetoothComponentContainer
      component={component}
      onEdit={handleEditComponent}
      handleReadValue={readValue}
    >
      <input
        type='range'
        min={component?.sliderProperties?.min}
        max={component?.sliderProperties?.max}
        step={component?.sliderProperties?.step}
        value={sliderValue}
        disabled={!characteristic?.properties?.write || component.bluetoothProperties.state === 'DISCONNECTED'}
        onChange={e => handleValueChange(e)}
        className='w-full cursor-pointer'
      />
    </BluetoothComponentContainer>
  )
}

export default SliderComponent
