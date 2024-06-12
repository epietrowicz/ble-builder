import React from 'react'
import { useBluetooth } from '../../hooks/useBluetooth'
import TextInput from '../ui/TextInput'
import SolidButton from '../ui/SolidButton'
import OutlineButton from '../ui/OutlineButton'
import { BluetoothIcon, BluetoothOff, VideoIcon } from 'lucide-react'
import { track } from '../../lib/mixpanel'

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
              <BluetoothIcon className='md:mr-2' />
              <span className='hidden md:block'>Start scan</span>
            </SolidButton>
          </>
          )
        : connectionState === 'CONNECTING'
          ? (
            <>
              <SolidButton disabled>
                <BluetoothIcon className='md:mr-2' />
                {/* Connecting... */}
                <span className='hidden md:block'>Connecting</span>
              </SolidButton>
            </>
            )
          : (
            <>
              <SolidButton onClick={disconnectDevice}>
                <BluetoothOff className='md:mr-2' />
                {/* Disconnect */}
                <span className='hidden md:block'>Disconnect</span>
              </SolidButton>
            </>
            )}

      <OutlineButton onClick={() => {
        track('Demo clicked | BLE Builder')
        window.open('https://pietrowicz-portfolio.s3.amazonaws.com/blueprint-demo-1.mp4', '_blank')
      }}
      >
        <VideoIcon className='md:mr-2' />
        <span className='hidden md:block'>Demo</span>
      </OutlineButton>
    </div>
  )
}

export default Header
