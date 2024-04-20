import React from 'react'
import { useComponentsContext } from '../../hooks/useComponents'
import { X } from 'lucide-react'

const BluetoothComponentContainer = ({ children, component }) => {
  const { removeComponent } = useComponentsContext()

  const handleDelete = () => {
    removeComponent(component)
  }

  return (
    <div className='border p-8 relative'>
      <label className='block mb-2 text-xl font-bold'>
        {component.componentLabel}
      </label>
      {children}
      <button
        onClick={handleDelete}
        className='absolute right-0 top-0 p-2'
      >
        <X className='text-gray-300 h-5 w-5' />
      </button>
    </div>
  )
}

export default BluetoothComponentContainer
