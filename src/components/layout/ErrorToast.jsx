import React, { useEffect, useState } from 'react'
import { useBluetooth } from '../../hooks/useBluetooth'
import { TriangleAlertIcon, XIcon } from 'lucide-react'

const ErrorToast = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { error, setError } = useBluetooth()

  useEffect(() => {
    if (error) setIsOpen(true)
  }, [JSON.stringify(error)])

  const handleClearError = () => {
    setError(null)
    setIsOpen(false)
  }

  return isOpen
    ? (
      <div className='absolute bottom-0 right-0 p-4 m-4 border border-red-600 max-w-72 overflow-auto break-words'>
        <div className='flex items-center space-x-2 mb-2 text-red-600'>
          <TriangleAlertIcon className='h-5 w-5' />
          <h2 className='font-semibold'>Error</h2>
        </div>
        <button onClick={handleClearError} className='absolute top-4 right-4 '>
          <XIcon className='w-4 h-4 text-gray-500' />
        </button>
        <p className='text-sm text-gray-600 mb-1'>{error.message}</p>
      </div>
      )
    : (<></>)
}

export default ErrorToast
