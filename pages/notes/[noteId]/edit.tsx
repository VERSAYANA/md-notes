import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import EditNote from '../../../components/EditNote'
import { Database } from '../../../utils/database.types'
type Note = Database['public']['Tables']['notes']['Row']

function EditNotePage() {
  const supabase = useSupabaseClient()
  const user = useUser()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [note, setNote] = useState<Note>()
  const { noteId } = router.query

  useEffect(() => {
    async function getNote() {
      try {
        setIsLoading(true)
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

  async function saveNote(title: string, content: string) {
    try {
      setIsSaving(true)
      if (!user) throw new Error('No user')
      const { data, error } = await supabase
        .from('notes')
        .update({
          title,
          content,
        })
        .eq('id', noteId)

      if (error) throw error
    } catch (error) {
      console.log(error)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="container mx-auto flex flex-1 flex-col px-4 py-4 md:py-8">
      <EditNote
        title={note?.title ? note?.title : ''}
        content={note?.content ? note?.content : ''}
        isLoading={isLoading}
        saveNote={saveNote}
        isSaving={isSaving}
      />
    </div>
  )
}

export default EditNotePage
