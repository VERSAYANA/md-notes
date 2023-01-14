import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import NotesSummary from '../../components/NotesSummary'
import UserInformation from '../../components/UserInformation'
import { Database } from '../../utils/database.types'
import type { NoteSummary } from '../../utils/types'
type Profiles = Database['public']['Tables']['profiles']['Row']

function UserNotesPage() {
  const router = useRouter()
  const { username } = router.query
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

        console.log(data)

        if (error && status !== 406) {
          throw error
        }

        console.log(data)

        if (data) {
          setNotes(data)
        }
      } catch (error) {
        console.log(error)
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
    <div className="containter flex w-full flex-1 flex-col items-center justify-center p-4 md:p-8">
      {profile && <UserInformation profile={profile} />}
      <NotesSummary notes={notes} showPublicPrivateIcon={true} />
    </div>
  )
}

export default UserNotesPage