import React from 'react'
import Sidebar from './Sidebar'
import Header from './Header'
import CallToAction from './CallToAction'
import ErrorToast from './ErrorToast'

const Layout = ({ children }) => {
  return (
    <div className='flex items-start relative'>
      <Sidebar />
      <div className='flex-1 min-h-screen flex flex-col justify-start'>
        <Header />
        {children}
      </div>
      <CallToAction />
      <ErrorToast />
    </div>
  )
}

export default Layout
