import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import EditNote from '../../../components/EditNote'
import { Database } from '../../../utils/database.types'
type Note = Database['public']['Tables']['notes']['Row']

function EditNotePage() {
  const supabase = useSupabaseClient()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [note, setNote] = useState<Note>()

  console.log(note)

  const { noteId } = router.query
  console.log(noteId)
  useEffect(() => {
    async function getNote() {
      try {
        const { data, error, status } = await supabase
          .from('notes')
          .select('*')
          .eq('id', noteId)
          .single()

        if (error && status !== 406) {
          throw error
        }
        if (data) {
          setNote(data)
        }
      } catch (error) {
        console.log(error)
      } finally {
        setIsLoading(false)
      }
    }

    getNote()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [noteId])

  return (
    <div className="container mx-auto flex flex-1 flex-col">
      <h2>{noteId}</h2>
      <EditNote />
    </div>
  )
}

export default EditNotePage
