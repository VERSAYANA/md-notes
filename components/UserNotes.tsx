import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Database } from '../utils/database.types'
type Notes = Database['public']['Tables']['notes']['Row']

type UserNoteSummary = {
  id: string
  title: string
  updated_at: string
  is_public: boolean
}

function Notes() {
  const user = useUser()
  const [isLoading, setIsLoading] = useState(true)
  const supabase = useSupabaseClient<Database>()
  const [notes, setNotes] = useState<UserNoteSummary[]>([])

  useEffect(() => {
    async function getNotes() {
      try {
        setIsLoading(true)
        if (!user) throw new Error('No user')
        let { data, error, status } = await supabase
          .from('notes')
          .select(`id, updated_at, title, is_public`)
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

  return (
    <div className="container mx-auto flex w-full flex-1 flex-col gap-y-8">
      {notes.map((note) => (
        <div
          key={note.id}
          className="flex flex-col rounded-lg bg-base-100 p-4 shadow-md"
        >
          <h2 className="text-xl font-bold">{note.title}</h2>
          {/* <p>{note.content}</p> */}
          <p>{new Date(note.updated_at).toLocaleDateString()}</p>
          <div className="flex justify-end">
            <Link
              className="btn flex"
              target={'_blank'}
              href={`/notes/${note.id}`}
            >
              Open note
            </Link>
          </div>
        </div>
      ))}
    </div>
  )
}

export default Notes
