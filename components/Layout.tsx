import Navbar from './Navbar'
import React, { ReactNode } from 'react'

type Props = {
  children?: ReactNode
}

export default function Layout({ children }: Props) {
  return (
    <>
      <Navbar />
      <main className="h-full">{children}</main>
    </>
  )
}
