import Navbar from './Navbar'
import React, { ReactNode, useEffect, useState } from 'react'

import Drawer from './Drawer'
import Link from 'next/link'
import { Edit, Edit2, FilePlus, LogIn, LogOut, User } from 'react-feather'
import { useUser } from '@supabase/auth-ui-react/dist/esm/src/components/Auth/UserContext'
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react'
import { Database } from '../utils/database.types'

type Props = {
  children?: ReactNode
}

type TagsWithNoteCount = {
  tag_name: string
  notes_count: number
}[]

export default function Layout({ children }: Props) {
  const session = useSession()
  const supabase = useSupabaseClient<Database>()
  const [tagsWithNoteCount, setTagsWithNoteCount] = useState<TagsWithNoteCount>(
    []
  )
  const [username, setUsername] = useState<string>('')
  const [userNotesCount, setUserNotesCount] = useState(0)
  async function getUserTagsWithNotesCount(userId: string) {
    try {
      console.log(userId)

      const { data, error } = await supabase
        .rpc('get_user_tags_with_notes_count', { p_user_id: userId })
        .select()
        .order('notes_count', { ascending: false })

      if (error) throw error

      if (data) setTagsWithNoteCount(data)

      console.log(data)
    } catch (error) {
      console.error(error)
    }
  }

  async function getUserNotesCount(userId: string) {
    try {
      const { data, error } = await supabase
        .from('notes')
        .select('id')
        .eq('user_id', userId)

      if (error) throw error

      console.log(data)

      if (data) setUserNotesCount(data.length)

      console.log(data)
    } catch (error) {
      console.error(error)
    }
  }

  async function getUsername(userId: string) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('username')
        .eq('id', userId)
        .single()

      console.log(data)

      if (error) throw error
      if (data) setUsername(data.username as string)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    if (session?.user) {
      getUsername(session.user.id)
      getUserNotesCount(session.user.id)
      getUserTagsWithNotesCount(session.user.id)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.user])

  return (
    <div className="drawer-mobile drawer">
      <input id="drawer" className="drawer-toggle" type="checkbox" />
      <div className="drawer-content overflow-x-hidden">
        <Navbar />
        <main className="flex flex-col">{children}</main>
      </div>
      <div className="drawer-side">
        <label htmlFor="drawer" className="drawer-overlay"></label>
        <aside className="flex h-full min-h-0 w-80 flex-col bg-base-100">
          <div className="flex h-16 w-full items-center px-4">
            <Link
              className="btn btn-ghost w-full justify-start gap-x-3 text-base normal-case text-primary"
              href="/notes/new"
            >
              <FilePlus size={24} />
              <span className="font-normal">New note</span>
            </Link>
          </div>
          <div className="flex h-full flex-1 flex-col overflow-y-auto border-y">
            {session?.user && (
              <>
                <h4 className="px-8 pt-4 pb-2 text-base font-bold">My notes</h4>
                <ul className="menu bg-base-100 px-4 text-base-content">
                  <li>
                    <Link
                      className="flex justify-between text-base-content"
                      href={`/${username}/notes`}
                    >
                      <span>All</span>
                      <span className="opacity-75">{userNotesCount}</span>
                    </Link>
                  </li>
                  {tagsWithNoteCount.map((tagWithNoteCount) => (
                    <li key={tagWithNoteCount.tag_name}>
                      <Link
                        className="flex justify-between text-base-content"
                        href={`/${username}/notes/tag/${tagWithNoteCount.tag_name}`}
                      >
                        <span>{tagWithNoteCount.tag_name}</span>
                        <span className="opacity-75">
                          {tagWithNoteCount.notes_count}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
          <div className={`flex flex-col ${session?.user ? 'h-48' : 'h-32'}`}>
            {session?.user ? (
              <>
                {/* <div className="flex h-16 w-full items-center gap-x-3 px-8 text-base">
                  <User size={24} />
                  <span className="uppercase">{username || ''}</span>
                </div> */}
                <div className="flex h-16 w-full items-center px-4">
                  <Link
                    className="btn btn-ghost w-full justify-start  gap-x-3 text-base normal-case text-primary"
                    href={username ? `/${username}` : `/profile`}
                  >
                    <User size={24} />
                    <span className="font-normal uppercase">
                      {username || ''}
                    </span>
                  </Link>
                </div>
                <div className="flex h-16 w-full items-center px-4">
                  <Link
                    className="btn btn-ghost w-full justify-start  gap-x-3 text-base normal-case text-primary"
                    href="/profile"
                  >
                    <Edit2 size={24} />
                    <span className="font-normal normal-case">
                      Edit profile
                    </span>
                  </Link>
                </div>
                <div className="flex h-16 w-full items-center px-4">
                  <Link
                    className="btn btn-ghost w-full justify-start  gap-x-3 text-base normal-case text-primary"
                    href="/auth"
                  >
                    <LogOut size={24} />
                    <span className="font-normal">Log out</span>
                  </Link>
                </div>
              </>
            ) : (
              <>
                <div className="flex h-16 w-full items-center gap-x-3 px-8 text-base">
                  <User size={24} />
                  <span className="uppercase">Anonymous</span>
                </div>
                <div className="flex h-16 w-full items-center px-4">
                  <Link
                    className="btn btn-ghost w-full justify-start  gap-x-3 text-base normal-case text-primary"
                    href="/auth"
                  >
                    <LogIn size={24} />
                    <span className="font-normal">Sign in / Sing up</span>
                  </Link>
                </div>
              </>
            )}
          </div>
        </aside>
      </div>
    </div>
  )
}
