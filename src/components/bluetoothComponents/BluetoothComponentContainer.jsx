import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useComponents } from '../../hooks/useComponents'
import { EllipsisIcon } from 'lucide-react'
import useClickOutside from '../../hooks/useClickOutside'

const BluetoothComponentContainer = ({ children, component, onEdit, handleReadValue }) => {
  const { removeComponent } = useComponents()
  const [showDropdown, setShowDropdown] = useState(false)
  const menuRef = useRef(null)
  const characteristic = component?.bluetoothProperties?.gattCharacteristic ?? null

  useEffect(() => {}, [JSON.stringify(characteristic)])

  useClickOutside(menuRef, () => {
    setShowDropdown(false)
  })

  const handleDelete = () => {
    removeComponent(component)
  }

  const state = component?.bluetoothProperties?.state
  const badgeBaseClasses = 'inline-block text-xs font-medium me-2 px-2.5 py-0.5 rounded mt-2'

  const componentStateBadge = useMemo(() => {
    switch (state) {
      case 'DISCONNECTED':
        return (
          <span className={`bg-gray-100 text-gray-800 ${badgeBaseClasses}`}>
            Disconnected
          </span>
        )
      case 'CONNECTED':
        return (
          <span className={`bg-green-100 text-green-800 ${badgeBaseClasses}`}>
            Connected
          </span>
        )
      case 'CHARACTERISTIC_NOT_FOUND':
        return (
          <span className={`bg-red-100 text-red-800 ${badgeBaseClasses}`}>
            Characteristic not found
          </span>
        )
      default:
        return (
          <span className={`bg-red-100 text-red-800 ${badgeBaseClasses}`}>
            Service not found
          </span>
        )
    }
  }, [JSON.stringify(component)])

  return (
    <div className='border p-4 relative'>
      <label className='block text-xl font-bold'>
        {component?.componentLabel}
      </label>
      {componentStateBadge}
      <div className='mt-4'>
        {children}
      </div>
      <button
        data-dropdown-toggle='dropdown'
        onClick={() => { setShowDropdown(prev => !prev) }}
        className='absolute right-0 top-0 p-2'
      >
        <EllipsisIcon className='text-gray-300 h-5 w-5' />
      </button>
      <div ref={menuRef} className={`absolute right-2 top-8 z-10 ${!showDropdown && 'hidden'} bg-white border w-44`}>
        <ul className='py-2 text-sm text-gray-700' aria-labelledby='dropdownDefaultButton'>
          {characteristic?.properties?.read && (
            <li>
              <span
                className='block cursor-pointer px-4 py-2 hover:bg-gray-100'
                onClick={() => {
                  handleReadValue()
                  setShowDropdown(false)
                }}
              >
                Read value
              </span>
            </li>)}
          <li>
            <span
              onClick={onEdit}
              className='block cursor-pointer px-4 py-2 hover:bg-gray-100'
            >
              Edit
            </span>
          </li>
          <li>
            <span
              onClick={handleDelete}
              className='block cursor-pointer px-4 py-2 hover:bg-red-100 hover:text-red-800'
            >
              Delete
            </span>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default BluetoothComponentContainer
