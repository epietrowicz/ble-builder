import { LoaderCircle } from 'lucide-react'
import React from 'react'

const SolidButton = ({ onClick, children, disabled = false, additionalClasses, loading = false }) => {
  const disabledClasses = 'bg-gray-400 text-white border border-gray-400'
  const enabledClasses = 'bg-black text-white border border-black'
  const classes = `${additionalClasses} ${disabled ? disabledClasses : enabledClasses} flex py-2 px-3`
  return (
    <button
      onClick={onClick}
      className={classes}
      disabled={disabled || loading}
    >
      {!loading
        ? children
        : <Spinner />}
    </button>
  )
}

const Spinner = () => {
  return (
    <div role='status' className='animate-spin'>
      <LoaderCircle className='h-5 w-5' />
    </div>
  )
}

export default SolidButton
