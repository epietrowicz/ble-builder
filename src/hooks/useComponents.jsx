import React, { createContext, useContext, useEffect, useState } from 'react'

// Create the context
const ComponentsContext = createContext()

export const useComponents = () => {
  const context = useContext(ComponentsContext)
  if (!context) {
    throw new Error('useComponents must be used within an ComponentsProvider')
  }
  return context
}

// Create the provider component
export const ComponentsProvider = ({ children }) => {
  const [components, setComponents] = useState(JSON.parse(window.localStorage.getItem('components')) || [])

  useEffect(() => {
    window.localStorage.setItem('components', JSON.stringify(components))
  }, [components])

  const addComponent = (component) => {
    setComponents(prev => [...prev, component])
  }

  const removeComponent = (component) => {
    setComponents(prev => prev.filter(c => c.id !== component.id))
  }

  return (
    <ComponentsContext.Provider value={{
      components,
      addComponent,
      removeComponent
    }}
    >
      {children}
    </ComponentsContext.Provider>
  )
}
