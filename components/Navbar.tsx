import React from 'react'
import Link from 'next/link'
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react'
import { Database } from '../utils/database.types'

function Navbar() {
  const supabase = useSupabaseClient<Database>()
  const user = useUser()

  const signIn = () => {
    console.log('sign in')
  }

  const signInButton = (
    <Link href="/auth" className="btn-ghost btn">
      Sign In
    </Link>
  )

  const signOutButton = (
    <button onClick={() => supabase.auth.signOut()} className="btn-ghost btn">
      Sign Out
    </button>
  )

  let signInSignOutButton = null
  if (user) {
    signInSignOutButton = signOutButton
  } else {
    signInSignOutButton = signInButton
  }

  return (
    <div className="navbar justify-between bg-primary text-primary-content">
      <Link href="/notes/new" className="btn-ghost btn">
        New Note
      </Link>
      <div>{signInSignOutButton}</div>
    </div>
  )
}

export default Navbar
