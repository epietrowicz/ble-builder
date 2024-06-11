import React from 'react'
import Sidebar from './Sidebar'
import SolidButton from '../ui/SolidButton'
import { BluetoothIcon, BluetoothOff } from 'lucide-react'
import { useBluetooth } from '../../hooks/useBluetooth'
import TextInput from '../ui/TextInput'

const Layout = ({ children }) => {
  return (
    <div className='flex items-start'>
      <Sidebar />
      <div className='flex-1 min-h-screen flex flex-col justify-start'>
        <Header />
        {children}
      </div>
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
