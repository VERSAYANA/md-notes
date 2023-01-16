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
import Avatar from './Avatar'
import dayjs from '../utils/dayjs'
import { Delete, Edit, Trash, Trash2 } from 'react-feather'

type Note = {
  id: string
  title: string
  content: string
  is_public: boolean
  updated_at: string
  created_at: string
  tags: string[]
  user_id: string
  username: string
  full_name: string
  avatar_url: string
} | null

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
  const [note, setNote] = useState<Note>()

  useEffect(() => {
    async function getNoteById() {
      try {
        setIsLoading(true)
        // let { data, error, status } = await supabase
        //   .from('notes')
        //   .select(`*`)
        //   .eq('id', id)
        //   .single()

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

    getNoteById()
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
      <div className="container mx-auto flex h-full w-full flex-1 flex-col px-4 pb-4 pt-8 md:px-6">
        {note ? (
          <div className="flex h-full flex-col">
            <div className="mb-10 mt-2 flex items-center justify-between gap-x-4">
              <Link
                href={`/${note.username ? note.username : ''}`}
                className="flex h-12 gap-x-4"
              >
                <Avatar url={note.avatar_url || ''} height={48} width={48} />
                <span className="text-md flex h-full items-center md:text-lg">
                  {note.full_name ? note.full_name : note.username || ''}
                </span>
              </Link>
              <p className="flex h-full items-center justify-end text-sm opacity-70">
                {dayjs(note.updated_at).fromNow(true)} ago
              </p>
            </div>
            <div className="mb-6 flex items-center justify-between gap-x-2">
              <div className="flex flex-1">
                <h2 className="text-lg font-bold md:text-xl">{note.title}</h2>
              </div>
              {user && note.user_id === user.id ? (
                <div className="flex items-center gap-x-2">
                  <button
                    onClick={() => setIsOpen(true)}
                    className="btn-error btn m-0 h-12 w-12 gap-x-2 p-0 md:h-auto md:w-auto md:px-4"
                  >
                    <Trash2 />
                    <span className="hidden md:block">Delete</span>
                  </button>
                  <Link
                    href={`${id}/edit`}
                    className="btn m-0 h-12 w-12 gap-x-2 p-0 md:h-auto md:w-auto md:px-4"
                  >
                    <Edit />
                    <span className="hidden md:block">Edit</span>
                  </Link>
                </div>
              ) : null}
            </div>
            <div className="flex flex-1 justify-center rounded-lg bg-base-100 px-6 py-4 shadow-md">
              <Viewer value={note.content || ''} plugins={plugins} />
            </div>
            <div className="items-cente mt-4 flex flex-wrap gap-2">
              {note.tags.map((tag) => (
                <Link
                  href={`/tag/${tag}`}
                  className="rounded-full bg-base-100 px-3 py-2 shadow"
                  key={tag}
                >
                  {tag}
                </Link>
              ))}
            </div>
          </div>
        ) : null}
      </div>
      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className="relative z-50"
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
