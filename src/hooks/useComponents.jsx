import React, { createContext, useContext, useEffect, useState } from 'react'

const ComponentsContext = createContext()

export const useComponents = () => {
  const context = useContext(ComponentsContext)
  if (!context) {
    throw new Error('useComponents must be used within an ComponentsProvider')
  }
  return context
}

export const ComponentsProvider = ({ children }) => {
  const [components, setComponents] = useState(JSON.parse(window.localStorage.getItem('components')) || [])
  const [focusedComponent, setFocusedComponent] = useState(null)

  useEffect(() => {
    window.localStorage.setItem('components', JSON.stringify(components))
  }, [JSON.stringify(components)])

  const addComponent = (component) => {
    setComponents(prev => [...prev, component])
  }

  const removeComponent = (component) => {
    setComponents(prev => prev.filter(c => c.id !== component.id))
  }

  const updateComponentSpecificProperty = (component, key, value) => {
    setComponents(prev => {
      const newComponents = [...prev]
      const idx = newComponents.findIndex(c => c.id === component.id)
      if (component.type === 'SLIDER') {
        component.sliderProperties[key] = value
      }
      newComponents[idx] = component
      return newComponents
    })
  }

  const updateComponent = (newComponent) => {
    setComponents(prev => {
      const newComponents = [...prev]
      const idx = newComponents.findIndex(c => c.id === newComponent.id)
      newComponents[idx] = newComponent
      return newComponents
    })
  }

  return (
    <ComponentsContext.Provider value={{
      components,
      updateComponent,
      updateComponentSpecificProperty,
      addComponent,
      removeComponent,
      focusedComponent,
      setFocusedComponent
    }}
    >
      {children}
    </ComponentsContext.Provider>
  )
}
