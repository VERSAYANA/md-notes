import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { Database } from '../utils/database.types'
type Notes = Database['public']['Tables']['notes']['Row']

type Props = {
  id: string
}

function Notes({ id }: Props) {
  const user = useUser()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState(false)
  const supabase = useSupabaseClient<Database>()
  const [note, setNote] = useState<Notes>()

  useEffect(() => {
    async function getNotes() {
      try {
        setIsLoading(true)
        let { data, error, status } = await supabase
          .from('notes')
          .select(`*`)
          .eq('id', id)
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

    getNotes()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  async function deleteNote() {
    try {
      setIsDeleting(true)
      const { error } = await supabase.from('notes').delete().eq('id', id)
      if (error) {
        throw error
      } else {
        router.push('/')
      }
    } catch (error) {
      console.log(error)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="container mx-auto flex w-full flex-1 flex-col p-4">
      {note ? (
        <div className="flex flex-col">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-bold">{note.title}</h2>
            {user ? (
              <div className="flex items-center gap-x-2">
                <button onClick={() => deleteNote()} className="btn-error btn">
                  Delete
                </button>
                <Link href={`${id}/edit`} className="btn">
                  Edit
                </Link>
              </div>
            ) : null}
          </div>
          <p>{note.content}</p>
          <p>{new Date(note.updated_at).toLocaleDateString()}</p>
        </div>
      ) : null}
    </div>
  )
}

export default Notes
