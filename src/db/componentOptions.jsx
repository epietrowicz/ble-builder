import {
  AreaChart,
  MousePointerClick,
  Palette,
  SlidersHorizontal,
  ToggleLeft
} from 'lucide-react'

export default [
  {
    id: 1,
    type: 'SLIDER',
    title: 'Slider',
    description: 'A slider',
    icon: (<SlidersHorizontal />),
    availableProperties: [
      'READ',
      'WRITE',
      'NOTIFY'
    ]
  },
  {
    id: 2,
    type: 'BUTTON',
    title: 'Button',
    description: 'A Button',
    icon: (<MousePointerClick />),
    availableProperties: [
      'WRITE'
    ]
  },
  {
    id: 3,
    type: 'COLOR_PICKER',
    title: 'Color Picker',
    description: 'A Color Picker',
    icon: (<Palette />),
    availableProperties: [
      'READ',
      'WRITE',
      'NOTIFY'
    ]
  },
  {
    id: 4,
    type: 'TOGGLE',
    title: 'Toggle',
    description: 'A Toggle',
    icon: (<ToggleLeft />),
    availableProperties: [
      'READ',
      'WRITE',
      'NOTIFY'
    ]
  },
  {
    id: 5,
    type: 'CHART',
    title: 'Chart',
    description: 'A Chart',
    icon: (<AreaChart />),
    availableProperties: [
      'READ',
      'NOTIFY'
    ]
  }
]
