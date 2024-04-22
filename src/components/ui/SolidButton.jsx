import React from 'react'

const SolidButton = ({ onClick, children, disabled = false, additionalClasses }) => {
  const disabledClasses = 'bg-gray-400 text-white border border-gray-400'
  const enabledClasses = 'bg-black text-white border border-black'
  const classes = `${additionalClasses} ${disabled ? disabledClasses : enabledClasses} flex py-2 px-3`
  return (
    <button
      onClick={onClick}
      className={classes}
      disabled={disabled}
    >
      {children}
    </button>
  )
}

export default SolidButton
