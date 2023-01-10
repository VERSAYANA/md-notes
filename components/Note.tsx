import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { Database } from '../utils/database.types'
import { Viewer } from '@bytemd/react'
import gfm from '@bytemd/plugin-gfm'
import highlight from '@bytemd/plugin-highlight-ssr'
import math from '@bytemd/plugin-math-ssr'
import breaks from '@bytemd/plugin-breaks'
import { Dialog } from '@headlessui/react'

type Notes = Database['public']['Tables']['notes']['Row']

type Props = {
  id: string
}
const plugins = [
  gfm(),
  highlight(),
  math({
    katexOptions: {
      output: 'mathml',
    },
  }),
  breaks(),
]

function Notes({ id }: Props) {
  const user = useUser()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
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
        console.error(error)
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
      console.error(error)
    } finally {
      setIsDeleting(false)
      setIsOpen(false)
    }
  }

  return (
    <>
      <div className="container mx-auto flex w-full flex-1 flex-col p-4 pt-8">
        {note ? (
          <div className="flex flex-col">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold">{note.title}</h2>
              {user ? (
                <div className="flex items-center gap-x-2">
                  <button
                    onClick={() => setIsOpen(true)}
                    className="btn-error btn"
                  >
                    Delete
                  </button>
                  <Link href={`${id}/edit`} className="btn">
                    Edit
                  </Link>
                </div>
              ) : null}
            </div>
            <div className="flex flex-1 justify-center">
              <Viewer value={note.content || ''} plugins={plugins} />
            </div>
            <p>{new Date(note.updated_at).toLocaleDateString()}</p>
          </div>
        ) : null}
      </div>
      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className="relative  z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center  justify-center p-4">
          <Dialog.Panel className="w-full max-w-lg rounded-lg bg-base-200">
            <Dialog.Title className="px-4 pt-4 text-lg font-bold md:px-6">
              Delete note
            </Dialog.Title>
            <Dialog.Description className="p-4 opacity-80 md:px-6">
              Are you sure you want to delete this note?
              <br />
              This note will be permanently removed.
            </Dialog.Description>

            <div className="flex justify-end gap-x-2 rounded-b-lg bg-base-300 p-4">
              <button
                className="btn-ghost btn"
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </button>
              <button
                className={`btn-error btn ${isDeleting && 'loading'}`}
                onClick={() => deleteNote()}
              >
                Delete
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  )
}

export default Notes
