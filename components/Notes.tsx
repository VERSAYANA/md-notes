import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react'
import { useEffect, useState } from 'react'
import { Database } from '../utils/database.types'
type Notes = Database['public']['Tables']['notes']['Row']

function Notes() {
  const user = useUser()
  const [isLoading, setIsLoading] = useState(true)
  const supabase = useSupabaseClient<Database>()
  const [notes, setNotes] = useState<Notes[]>([])

  useEffect(() => {
    async function getNotes() {
      try {
        setIsLoading(true)
        if (!user) throw new Error('No user')
        let { data, error, status } = await supabase
          .from('notes')
          .select(`*`)
          .eq('user_id', user.id)

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

    getNotes()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  console.log(notes)

  return <div>Notes</div>
}

export default Notes
