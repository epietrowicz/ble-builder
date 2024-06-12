import React from 'react'

const CharacteristicProperties = ({ isRead = false, isWrite = false, isNotify = false }) => {
  return (
    <div>
      <span className='text-lg font-semibold'>Available properties for this component</span>
      <ul className='flex flex-col space-y-2 mt-2'>
        {isRead && (
          <li>
            <span>Read</span>
            <p className='text-sm text-gray-500'>Read a value from your peripheral device</p>
          </li>
        )}
        {isWrite && (
          <li>
            <span>Write</span>
            <p className='text-sm text-gray-500'>Write a value to your peripheral device</p>
          </li>
        )}
        {isNotify && (
          <li>
            <span>Notify</span>
            <p className='text-sm text-gray-500'>Listen to changes of a value on your peripheral device</p>
          </li>
        )}
      </ul>
    </div>
  )
}

export default CharacteristicProperties
