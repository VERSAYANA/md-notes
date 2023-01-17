import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'

import { Database } from '@/utils/database.types'
import type { Note as NoteType } from '@/utils/types'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import Note from '@/components/Note'

function NotePage() {
  const router = useRouter()
  const noteId = router.query.noteId as string
  const supabase = useSupabaseClient<Database>()
  const [note, setNote] = useState<NoteType>()
  const [isLoading, setIsLoading] = useState(true)

  async function getNoteById(id: string) {
    try {
      setIsLoading(true)
      const { data, error, status } = await supabase
        .rpc('get_note_by_id', { n_note_id: id })
        .select()
        .single()

      if (error && status !== 406) {
        throw error
      }

      if (data) {
        setNote(data)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (noteId) {
      getNoteById(noteId)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [noteId])

  return (
    <>
      <Head>
        <title>{note?.title ? note.title : 'Note'}</title>
      </Head>
      <div className="container mx-auto flex w-full flex-1 flex-col">
        {note && <Note note={note} />}
      </div>
    </>
  )
}

export default NotePage
