import React from 'react'

const NumberInput = ({ label, placeholder, additionalClasses, value, onChange }) => {
  return (
    <label className={`${additionalClasses} block`}>
      <span>{label}</span>
      <input
        className='border w-full py-2 px-3 text-gray-700 focus:outline-none focus:border-black'
        type='number'
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </label>
  )
}

export default NumberInput
