import Navbar from './Navbar'
import React, { ReactNode } from 'react'

import Drawer from './Drawer'

type Props = {
  children?: ReactNode
}

export default function Layout({ children }: Props) {
  return (
    <div className="flex flex-col">
      <Navbar />
      <div className="flex flex-1">
        <Drawer />
        <main className="flex w-full flex-1">{children}</main>
      </div>
    </div>
  )
}
