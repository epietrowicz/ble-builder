import React from 'react'

const OutlineButton = ({ children, onClick }) => {
  return (
    <button
      onClick={onClick}
      className='py-2 px-3 bg-white text-black border border-black flex'
    >
      {children}
    </button>
  )
}

export default OutlineButton
