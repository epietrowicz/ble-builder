import React from 'react'

const OutlineButton = ({ text, onClick }) => {
  return (
    <button
      onClick={onClick}
      className='py-2 px-3 bg-white text-black border border-black'
    >
      {text}
    </button>
  )
}

export default OutlineButton
