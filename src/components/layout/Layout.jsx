import React, { useState } from 'react'
import Sidebar from './Sidebar'
import SolidButton from '../ui/SolidButton'
import { BluetoothIcon, BluetoothOff, XIcon } from 'lucide-react'
import { useBluetooth } from '../../hooks/useBluetooth'
import TextInput from '../ui/TextInput'

const Layout = ({ children }) => {
  const [ctaOpen, setCtaOpen] = useState(true)

  return (
    <div className='flex items-start relative'>
      <Sidebar />
      <div className='flex-1 min-h-screen flex flex-col justify-start'>
        <Header />
        {children}
      </div>

      {ctaOpen && (
        <div className='absolute bottom-0 right-0 p-4 m-4 border max-w-72'>
          <h2 className='font-semibold mb-2'>Thank you 🤝</h2>
          <button onClick={() => setCtaOpen(false)} className='absolute top-4 right-4 '>
            <XIcon className='w-4 h-4 text-gray-500' />
          </button>

          <p className='text-sm text-gray-600 mb-1'>I appreciate you giving Blueprint a try!</p>
          <p className='text-sm text-gray-600'>
            It's a work in progress. If you have any feedback please send it my way at{' '}
            <a className='text-blue-500 underline' href='mailto:ubiqueiot@gmail.com'>ubiqueiot@gmail.com</a>
          </p>
        </div>
      )}
    </div>
  )
}

const Header = () => {
  const {
    connectToDevice,
    disconnectDevice,
    connectionState,
    scanFilter,
    setScanFilter
  } = useBluetooth()

  return (
    <div className='w-full border-b flex justify-end p-4 space-x-2'>

      {connectionState === 'DISCONNECTED'
        ? (
          <>
            <TextInput
              placeholder='Scan filter'
              value={scanFilter}
              onChange={e => setScanFilter(e.target.value)}
            />
            <SolidButton onClick={connectToDevice}>
              <BluetoothIcon className='mr-2' />
              Start scan
            </SolidButton>
          </>
          )
        : connectionState === 'CONNECTING'
          ? (
            <>
              <SolidButton disabled>
                <BluetoothIcon className='mr-2' />
                Connecting...
              </SolidButton>
            </>
            )
          : (
            <>
              <SolidButton onClick={disconnectDevice}>
                <BluetoothOff className='mr-2' />
                Disconnect
              </SolidButton>
            </>
            )}
    </div>
  )
}

export default Layout
