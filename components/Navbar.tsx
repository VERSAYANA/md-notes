/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react'
import { Database } from '../utils/database.types'
import { ChevronDown, FilePlus, Home, Menu, Plus } from 'react-feather'
import Avatar from './Avatar'
type Profiles = Database['public']['Tables']['profiles']['Row']

function Navbar() {
  const supabase = useSupabaseClient<Database>()
  const user = useUser()
  const [username, setUsername] = useState<Profiles['username']>(null)
  const [avatarUrl, setAvatarUrl] = useState<Profiles['avatar_url']>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function getProfile() {
      try {
        setLoading(true)
        if (!user) throw new Error('No user')

        let { data, error, status } = await supabase
          .from('profiles')
          .select(`username, avatar_url`)
          .eq('id', user.id)
          .single()

        if (data) {
          setUsername(data.username)
          setAvatarUrl(data.avatar_url)
        }

        if (error && status !== 406) {
          throw error
        }
      } catch (error) {
        console.log(error)
      } finally {
        setLoading(false)
      }
    }
    if (user) {
      getProfile()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

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
  const userDropDown = (
    <div className="dropdown-bottom dropdown">
      <label tabIndex={0} className="btn-ghost btn">
        <div className="flex items-center gap-4">
          <ChevronDown size={24} />
          {<span>{username ? username : 'Profile'}</span>}
          {/* {avatarUrl ? (
            <Avatar url={a} />
          ) : null} */}
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
    <nav className="navbar sticky top-0 z-50 col-span-3 flex w-full justify-center bg-primary text-primary-content">
      <div className="container flex w-full justify-between">
        <div className="flex">
          <label
            htmlFor="drawer"
            className="drawer-button btn-ghost btn-square btn lg:hidden"
          >
            <Menu size={24} />
          </label>
          {/* <Link href="/" className="btn-ghost btn flex">
            <Home size={24} />
          </Link>
          <Link href="/notes/new" className="btn-ghost btn flex">
            <FilePlus size={24} />
          </Link> */}
        </div>
        <div className="flex">{topRight}</div>
      </div>
    </nav>
  )
}

export default Navbar
