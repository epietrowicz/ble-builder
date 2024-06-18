import { ChevronDownIcon } from 'lucide-react'
import React from 'react'

const StyledSelect = ({ value, onChange, options }) => {
  return (
    <div className='relative'>
      <select
        className='px-3 py-2 border w-full appearance-none hover:cursor-pointer'
        value={value}
        onChange={onChange}
      >
        {options.map(option => (
          <option key={option.id} value={option.value}>
            {option.label}
          </option>
        ))}

      </select>
      <div className='absolute top-1/2 -translate-y-1/2 right-3'>
        <ChevronDownIcon className='h-4 w-4 text-gray-500' />
      </div>
    </div>
  )
}

export default StyledSelect
