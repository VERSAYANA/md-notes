/* eslint-disable @next/next/no-img-element */
import Link from 'next/link'
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react'
import { ChevronDown, LogIn, Menu } from 'react-feather'

import type { Database } from '@/utils/database.types'

type Props = {
  username: string
}

function Navbar({ username }: Props) {
  const supabase = useSupabaseClient<Database>()
  const user = useUser()

  const signInButton = (
    <Link
      href="/auth"
      className="btn btn-ghost flex items-center gap-x-3 normal-case"
    >
      <LogIn size={24} />
      <span>Sign In / Sign Up</span>
    </Link>
  )

  const userDropDown = (
    <div className="dropdown-bottom dropdown">
      <label tabIndex={0} className="btn btn-ghost">
        <div className="flex items-center gap-4">
          <ChevronDown size={24} />
          {<span>{username ? username : 'Profile'}</span>}
        </div>
      </label>
      <ul
        tabIndex={0}
        className="dropdown-content menu rounded-box menu-compact mt-3 w-52 bg-base-100 p-2 text-base-content shadow"
      >
        {username ? (
          <li>
            <Link href={`/${username}/notes`}>Notes</Link>
          </li>
        ) : null}
        <li>
          <Link href={`/profile`}>Edit Profile</Link>
        </li>
        <li>
          <a onClick={() => supabase.auth.signOut()}>Logout</a>
        </li>
      </ul>
    </div>
  )

  let topRight = null
  if (user) {
    topRight = userDropDown
  } else {
    topRight = signInButton
  }
  return (
    <nav className="navbar sticky top-0 z-50 col-span-3 flex w-full justify-center bg-primary text-primary-content lg:hidden">
      <div className="container flex w-full justify-between">
        <div className="flex">
          <label
            htmlFor="drawer"
            className="btn-ghost btn drawer-button btn-square lg:hidden"
          >
            <Menu size={24} />
          </label>
        </div>
        <div className="flex">{topRight}</div>
      </div>
    </nav>
  )
}

export default Navbar
