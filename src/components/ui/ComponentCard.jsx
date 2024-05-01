import React from 'react'

const ComponentCard = ({ component }) => {
  const onDragStart = (e) => {
    e.dataTransfer.setData('componentType', component.type)
  }

  return (
    <div
      onDragStart={onDragStart}
      draggable
      className={`p-4 border 
      flex flex-col items-center justify-center 
      cursor-grabbing active:cursor-grabbing`}
    >
      <div className='mb-2'>{component.icon}</div>
      <h2 className='font-semibold'>{component.title}</h2>
      <p className='text-sm text-gray-500 text-center'>{component.description}</p>
    </div>
  )
}

export default ComponentCard
