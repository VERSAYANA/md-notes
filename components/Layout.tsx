import Navbar from './Navbar'
import React, { ReactNode } from 'react'

import Drawer from './Drawer'

type Props = {
  children?: ReactNode
}

export default function Layout({ children }: Props) {
  return (
    // <div className="flex h-screen flex-col">
    //   <Navbar />
    //   <div className="flex h-[calc(100vh_-_64px)]">
    //     <Drawer />
    //     <main className="flex h-full w-full overflow-y-auto">{children}</main>
    //   </div>
    // </div>
    <div className="flex h-screen flex-col">
      <Navbar />
      <div className="relative flex flex-1">
        <Drawer />
        <main className="relative mt-16 flex-1 overflow-y-auto lg:ml-80">
          {children}
        </main>
      </div>
    </div>
  )
}
