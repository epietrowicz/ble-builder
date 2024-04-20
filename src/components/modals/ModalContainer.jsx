import React from 'react'

const ModalContainer = ({ modalId, modalTitle, children }) => {
  return (
    <dialog id={modalId} className='border p-6 max-w-2xl'>
      <h2 className='font-semibold text-xl mb-4'>{modalTitle}</h2>
      {children}
    </dialog>
  )
}

export default ModalContainer
