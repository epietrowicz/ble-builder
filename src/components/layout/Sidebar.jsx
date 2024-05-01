import React from 'react'
import ComponentCard from '../ui/ComponentCard'

import {
  AreaChart,
  MousePointerClick,
  Palette,
  SlidersHorizontal,
  ToggleLeft
} from 'lucide-react'

const componentOptions = [
  {
    id: 1,
    type: 'SLIDER',
    title: 'Slider',
    description: 'Listen for or write incremental updates',
    icon: (<SlidersHorizontal />)
  },
  {
    id: 2,
    type: 'BUTTON',
    title: 'Button',
    description: 'Send a payload',
    icon: (<MousePointerClick />)
  },
  {
    id: 3,
    type: 'COLOR_PICKER',
    title: 'Color Picker',
    description: 'Send a color value',
    icon: (<Palette />)
  },
  {
    id: 4,
    type: 'TOGGLE',
    title: 'Toggle',
    description: 'Listen for or send a status change',
    icon: (<ToggleLeft />)
  },
  {
    id: 5,
    type: 'CHART',
    title: 'Chart',
    description: 'Graph changing values over time',
    icon: (<AreaChart />)
  }
]

const Sidebar = () => {
  return (
    <div className='w-56 border-r p-4 min-h-screen flex flex-col space-y-4'>
      {componentOptions.map((component) => (
        <ComponentCard key={component.type} component={component} />
      ))}
    </div>
  )
}

export default Sidebar
