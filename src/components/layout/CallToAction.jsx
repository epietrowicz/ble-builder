import { MessageSquareIcon, XIcon } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useBluetooth } from '../../hooks/useBluetooth'

const CallToAction = () => {
  const [ctaOpen, setCtaOpen] = useState(JSON.parse(window.localStorage.getItem('modal_open')) ?? true)
  const { error } = useBluetooth()

  useEffect(() => {
    window.localStorage.setItem('modal_open', ctaOpen)
  }, [ctaOpen])

  return ctaOpen && !error
    ? (
      <div className='absolute bottom-0 right-0 p-4 m-4 border max-w-96'>
        <h2 className='font-semibold mb-2'>Thank you 🤝</h2>
        <button onClick={() => setCtaOpen(false)} className='absolute top-4 right-4 '>
          <XIcon className='w-4 h-4 text-gray-500' />
        </button>
        <p className='text-sm text-gray-600'>
          Blueprint is a work in progress. If you have any feedback please email me!{' '}
          <a className='text-blue-500 underline' href='mailto:ubiqueiot@gmail.com'>ubiqueiot@gmail.com</a>
        </p>
        <p className='text-sm text-gray-600 mt-2'>
          Follow along with Blueprint's development:
        </p>
        <iframe className='w-full' src='https://ericpietrowicz.substack.com/embed' frameborder='0' />
      </div>
      )
    : !error
        ? (

          <div className='absolute bottom-0 right-0 p-4 m-4'>
            <button onClick={() => setCtaOpen(true)}>
              <MessageSquareIcon className='w-6 h-6' />
            </button>
          </div>
          )
        : <></>
}

export default CallToAction
