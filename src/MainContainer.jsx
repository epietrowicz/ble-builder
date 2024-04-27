import React, { useState } from 'react'
import { useComponents } from './hooks/useComponents'
import { PlusCircleIcon } from 'lucide-react'
import SolidButton from './components/ui/SolidButton'
import AddSliderComponentModal from './components/modals/AddSliderComponentModal'
import SliderComponent from './components/bluetoothComponents/SliderComponent'

const MainContainer = () => {
  const [isActive, setIsActive] = useState(false)
  const { components } = useComponents()

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
    }
  }

  const getComponentCard = (bleComponent) => {
    switch (bleComponent.type) {
      case 'SLIDER':
        return (
          <SliderComponent key={bleComponent.id} bleComponent={bleComponent} />
        )
      case 'BUTTON':
        return (
          <ButtonComponent key={bleComponent.id} bleComponent={bleComponent} />
        )
    }
  }

  return (
    <>
      <AddSliderComponentModal />
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDragEnd}
        className={`flex-1 relative ${isActive && 'bg-gray-100'}`}
      >
        <div className='grid grid-cols-3 p-4 gap-4 max-w-5xl mx-auto'>
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

const ButtonComponent = ({ bleComponent }) => {
  const onButtonPress = () => {
  }

  return (
    <div className='border p-8'>
      <h2 className='font-bold text-xl' />
      <SolidButton
        onClick={onButtonPress}
        additionalClasses='w-full'
      >
        {bleComponent.componentLabel}
      </SolidButton>
    </div>
  )
}

export default MainContainer
