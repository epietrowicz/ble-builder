import React from 'react'
import Sidebar from './Sidebar'

const Layout = ({ children }) => {
  return (
    <div className='flex items-start'>
      <Sidebar />
      <div className='flex-1 min-h-screen flex flex-col'>
        {children}
      </div>
    </div>
  )
}

export default Layout
