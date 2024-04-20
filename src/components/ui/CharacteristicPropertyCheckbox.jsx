import React from 'react'

const CharacteristicPropertyCheckbox = ({ checked, onChange, title, description }) => {
  return (
    <label className='flex items-start select-none'>
      <input type='checkbox' className='mr-2 mt-1.5' onChange={onChange} checked={checked} />
      <div>
        <span className='align-top'>{title}</span>
        <p className='text-sm text-gray-500'>{description}</p>
      </div>
    </label>
  )
}

export default CharacteristicPropertyCheckbox
