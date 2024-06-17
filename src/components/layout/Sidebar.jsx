import React from 'react'
import ComponentCard from '../ui/ComponentCard'

import {
  AreaChart,
  ListChecksIcon,
  MousePointerClick,
  Palette,
  SlidersHorizontal,
  ToggleLeft,
  TypeIcon
} from 'lucide-react'

const componentOptions = [
  {
    type: 'TEXT',
    title: 'Text value',
    description: 'Display a reading from your device',
    icon: (<TypeIcon />)
  },
  {
    type: 'SLIDER',
    title: 'Slider',
    description: 'Listen for or write incremental updates',
    icon: (<SlidersHorizontal />)
  },
  {
    type: 'BUTTON',
    title: 'Button',
    description: 'Send a payload with a button press',
    icon: (<MousePointerClick />)
  },
  {
    type: 'TOGGLE',
    title: 'Toggle',
    description: 'Listen for or send a status change',
    icon: (<ToggleLeft />)
  },
  {
    type: 'SELECT',
    title: 'Select',
    description: 'Listen for or send a payload from a range of options',
    icon: (<ListChecksIcon />)
  },
  {
    type: 'CHART',
    title: 'Chart',
    description: 'Graph changing values over time',
    icon: (<AreaChart />)
  },
  {
    type: 'COLOR_PICKER',
    title: 'Color Picker',
    description: 'Send a color value',
    icon: (<Palette />)
  }

]

const Sidebar = () => {
  return (
    <div className='h-screen w-[37%] max-w-56 border-r p-4 min-h-screen flex flex-col space-y-4 overflow-y-scroll'>
      {componentOptions.map((component) => (
        <ComponentCard key={component.type} component={component} />
      ))}
    </div>
  )
}

export default Sidebar
