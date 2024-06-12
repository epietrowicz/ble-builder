import React, { useEffect, useState } from 'react'
import { useComponents } from './hooks/useComponents'
import { PlusCircleIcon } from 'lucide-react'
import AddSliderComponentModal from './components/modals/AddSliderComponentModal'
import SliderComponent from './components/bluetoothComponents/SliderComponent'
import AddButtonComponentModal from './components/modals/AddButtonComponentModal'
import ButtonComponent from './components/bluetoothComponents/ButtonComponent'
import AddToggleComponentModal from './components/modals/AddToggleComponentModal'
import ToggleComponent from './components/bluetoothComponents/ToggleComponent'
import ComingSoonModal from './components/modals/ComingSoonModal'
import { track } from './lib/mixpanel'

const MainContainer = () => {
  const [isActive, setIsActive] = useState(false)
  const { components } = useComponents()

  useEffect(() => {
    track('BLE Builder main page')
  }, [])

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsActive(true)
  }

  const handleDragLeave = () => {
    setIsActive(false)
  }

  const handleDragEnd = (e) => {
    setIsActive(false)
    const componentType = e.dataTransfer.getData('componentType')
    if (componentType === 'SLIDER') {
      document.getElementById('add_slider_component_modal').showModal()
    } else if (componentType === 'BUTTON') {
      document.getElementById('add_button_component_modal').showModal()
    } else if (componentType === 'TOGGLE') {
      document.getElementById('add_toggle_component_modal').showModal()
    } else {
      document.getElementById('coming_soon_modal').showModal()
    }
  }

  const getComponentCard = (component) => {
    switch (component.type) {
      case 'SLIDER':
        return (<SliderComponent key={component.id} component={component} />)
      case 'BUTTON':
        return (<ButtonComponent key={component.id} component={component} />)
      case 'TOGGLE':
        return (<ToggleComponent key={component.id} component={component} />)
    }
  }

  return (
    <>
      <AddSliderComponentModal />
      <AddButtonComponentModal />
      <AddToggleComponentModal />
      <ComingSoonModal />
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDragEnd}
        className={`flex-1 relative ${isActive && 'bg-gray-100'}`}
      >
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 p-4 gap-4 max-w-5xl mx-auto'>
          {components.map(c => getComponentCard(c))}
        </div>

        {isActive && (
          <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>
            <PlusCircleIcon />
          </div>)}
      </div>
    </>
  )
}

export default MainContainer
