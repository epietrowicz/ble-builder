import { XIcon } from 'lucide-react'
import React, { useState } from 'react'
import { useBluetooth } from '../../hooks/useBluetooth'

const CallToAction = () => {
  const [ctaOpen, setCtaOpen] = useState(true)
  const { error } = useBluetooth()
  return ctaOpen && !error
    ? (
      <div className='absolute bottom-0 right-0 p-4 m-4 border max-w-96'>
        <h2 className='font-semibold mb-2'>Thank you 🤝</h2>
        <button onClick={() => setCtaOpen(false)} className='absolute top-4 right-4 '>
          <XIcon className='w-4 h-4 text-gray-500' />
        </button>
        {/*
        <p className='text-sm text-gray-600 mb-1'>I appreciate you giving Blueprint a try!</p> */}
        <p className='text-sm text-gray-600'>
          Blueprint is a work in progress. If you have any feedback please email me!{' '}
          <a className='text-blue-500 underline' href='mailto:ubiqueiot@gmail.com'>ubiqueiot@gmail.com</a>
        </p>
        <p className='text-sm text-gray-600 mt-2'>
          Follow along with my development process:
        </p>
        <iframe className='w-full' src='https://ericpietrowicz.substack.com/embed' frameborder='0' />
      </div>
      )
    : (<></>)
}

export default CallToAction
