import React from 'react'
import ComponentCard from '../ui/ComponentCard'

import {
  AreaChart,
  ListChecksIcon,
  MousePointerClick,
  Palette,
  SlidersHorizontal,
  ToggleLeft
} from 'lucide-react'

const componentOptions = [
  {
    id: 692271,
    type: 'SLIDER',
    title: 'Slider',
    description: 'Listen for or write incremental updates',
    icon: (<SlidersHorizontal />)
  },
  {
    id: 82048,
    type: 'BUTTON',
    title: 'Button',
    description: 'Send a payload',
    icon: (<MousePointerClick />)
  },
  {
    id: 237618,
    type: 'TOGGLE',
    title: 'Toggle',
    description: 'Listen for or send a status change',
    icon: (<ToggleLeft />)
  },
  {
    id: 731891,
    type: 'SELECT',
    title: 'Select',
    description: 'Listen for or send a payload from a range of options',
    icon: (<ListChecksIcon />)
  },
  {
    id: 755125,
    type: 'CHART',
    title: 'Chart',
    description: 'Graph changing values over time',
    icon: (<AreaChart />)
  },
  {
    id: 748389,
    type: 'COLOR_PICKER',
    title: 'Color Picker',
    description: 'Send a color value',
    icon: (<Palette />)
  }
]

const Sidebar = () => {
  return (
    <div className='w-[37%] max-w-56 border-r p-4 min-h-screen flex flex-col space-y-4'>
      {componentOptions.map((component) => (
        <ComponentCard key={component.type} component={component} />
      ))}
    </div>
  )
}

export default Sidebar
