import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import Notes from '../../../components/UserNotes'
import { Database } from '../../../utils/database.types'
import type { UserNoteSummary } from '../../../utils/types'
type Profiles = Database['public']['Tables']['profiles']['Row']

function UserNotesPage() {
  const router = useRouter()
  const { username } = router.query
  const [isLoading, setIsLoading] = useState(true)
  const supabase = useSupabaseClient<Database>()
  const [notes, setNotes] = useState<UserNoteSummary[]>([])
  const [userId, setUserId] = useState<Profiles['id']>()

  useEffect(() => {
    async function getUserId() {
      try {
        setIsLoading(true)
        let { data, error, status } = await supabase
          .from('profiles')
          .select(`id`)
          .eq('username', username)
          .single()

        if (error && status !== 406) {
          throw error
        }

        if (data) {
          setUserId(data.id)
        }
      } catch (error) {
        console.log(error)
      } finally {
        setIsLoading(false)
      }
    }

    if (username) {
      getUserId()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username])

  useEffect(() => {
    async function getNotes() {
      try {
        setIsLoading(true)
        let { data, error, status } = await supabase
          .from('notes')
          .select(`id, updated_at, title, is_public`)
          .eq('user_id', userId)

        if (error && status !== 406) {
          throw error
        }

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
      getNotes()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId])

  return (
    <div className="containter flex w-full flex-1 flex-col items-center justify-center p-4 md:p-8">
      <Notes notes={notes} />
    </div>
  )
}

export default UserNotesPage
