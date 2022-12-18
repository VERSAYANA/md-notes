import React from 'react'
import Link from 'next/link'

function Navbar() {
  const signIn = () => {
    console.log('sign in')
  }

  return (
    <div className="navbar justify-between bg-primary text-primary-content">
      <Link href="/" className="btn-ghost btn">
        Home
      </Link>
      <div>
        <button onClick={signIn} className="btn-ghost btn">
          Sign In
        </button>
      </div>
    </div>
  )
}

export default Navbar
