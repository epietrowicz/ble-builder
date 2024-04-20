import React from 'react'
import componentOptions from '../../db/componentOptions'
import ComponentCard from '../ui/ComponentCard'

const Sidebar = () => {
  return (
    <div className='w-56 border-r p-4 min-h-screen flex flex-col space-y-4'>
      {componentOptions.map((component) => (
        <ComponentCard key={component.type} component={component} />
      ))}
    </div>
  )
}

export default Sidebar
