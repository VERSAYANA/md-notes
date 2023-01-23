import { useSupabaseClient } from '@supabase/auth-helpers-react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import Head from 'next/head'

import NotesSummary from '@/components/NotesSummary'
import UserInformation from '@/components/UserInformation'
import type { Database } from '@/utils/database.types'
import type { NoteSummary } from '@/utils/types'

type Profiles = Database['public']['Tables']['profiles']['Row']

function UserNotesPage() {
  const router = useRouter()
  const username = router.query.username as string
  const [isLoading, setIsLoading] = useState(false)
  const supabase = useSupabaseClient<Database>()
  const [notes, setNotes] = useState<NoteSummary[]>([])
  const [userId, setUserId] = useState<Profiles['id']>()
  const [profile, setProfile] = useState<Profiles>()

  useEffect(() => {
    async function getProfileByUsername(username: string) {
      try {
        setIsLoading(true)
        let { data, error, status } = await supabase
          .from('profiles')
          .select(`*`)
          .eq('username', username)
          .single()

        if (error && status !== 406) {
          throw error
        }

        if (data) {
          setProfile(data)
          setUserId(data.id)
        }
      } catch (error) {
        console.error(error)
      } finally {
        setIsLoading(false)
      }
    }
    if (username) {
      getProfileByUsername(username as string)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username])

  useEffect(() => {
    async function getNotesByUserId() {
      try {
        setIsLoading(true)
        let { data, error, status } = await supabase
          .rpc('get_notes_by_user_id', { p_user_id: userId as string })
          .select()
          .order('updated_at', { ascending: false })

        if (error && status !== 406) {
          throw error
        }

        if (data) {
          setNotes(data)
        }
      } catch (error) {
        console.error(error)
      } finally {
        setIsLoading(false)
      }
    }
    if (userId) {
      getNotesByUserId()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId])

  return (
    <>
      <Head>
        <title>{username?.toUpperCase() || 'User Profile'}</title>
      </Head>
      <div className="containter mx-auto flex h-full w-full max-w-4xl flex-col items-center justify-center p-4 md:p-8">
        {profile && <UserInformation profile={profile} />}
        <section className="flex w-full flex-col">
          <div className="mb-4 mt-8 flex w-full items-center justify-between px-4">
            <h3 className="text-lg font-bold md:text-xl lg:text-2xl">
              Most Recent Notes
            </h3>
            <Link className="" href={`/${username}/notes`}>
              See more
            </Link>
          </div>
          <NotesSummary notes={notes} showPublicPrivateIcon={true} />
        </section>
      </div>
    </>
  )
}

export default UserNotesPage
