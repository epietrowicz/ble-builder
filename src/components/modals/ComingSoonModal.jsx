import React from 'react'
import SolidButton from '../ui/SolidButton'

const ComingSoonModal = () => {
  return (
    <dialog id='coming_soon_modal' className='border p-6 min-w-96'>
      <h2 className='font-semibold text-xl mb-4'>This component is coming soon!</h2>
      <div className='mt-8 flex items-center justify-end space-x-2'>
        <SolidButton
          onClick={() => document.getElementById('coming_soon_modal').close()}
        >
          Okay
        </SolidButton>
      </div>
    </dialog>
  )
}

export default ComingSoonModal
