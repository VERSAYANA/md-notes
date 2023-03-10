import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { Viewer } from '@bytemd/react'
import gfm from '@bytemd/plugin-gfm'
import highlight from '@bytemd/plugin-highlight-ssr'
import math from '@bytemd/plugin-math-ssr'
import breaks from '@bytemd/plugin-breaks'
import { Dialog } from '@headlessui/react'
import { Edit, Trash2 } from 'react-feather'

import Avatar from './Avatar'
import type { Database } from '@/utils/database.types'
import dayjs from '@/utils/dayjs'
import type { Note } from '@/utils/types'

type Props = {
  note: Note
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

function Notes({ note }: Props) {
  const id = note?.id
  const user = useUser()
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const supabase = useSupabaseClient<Database>()

  async function deleteNote(noteId: string) {
    try {
      setIsDeleting(true)
      const { error } = await supabase.rpc('delete_note_with_tags', {
        n_note_id: noteId,
      })
      if (error) {
        throw error
      } else {
        router.back()
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
                <Avatar url={note.avatar_url || ''} height={56} width={56} />
                <span className="text-md flex h-full items-center md:text-lg">
                  {note.full_name ? note.full_name : note.username || ''}
                </span>
              </Link>
              <p className="flex h-full items-center justify-end text-sm text-base-content/70 md:text-base">
                {dayjs(note.updated_at).fromNow(true)} ago
              </p>
            </div>
            <div className="mb-6 flex items-center justify-between gap-x-2">
              <div className="flex flex-1">
                <h2 className="text-lg font-bold md:text-xl lg:text-2xl 2xl:text-3xl">
                  {note.title}
                </h2>
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
              {note.tags.map((tag) => {
                if (tag !== null) {
                  return (
                    <Link
                      href={`/tag/${tag}`}
                      className="rounded-full bg-base-100 px-3 py-2 shadow"
                      key={tag}
                    >
                      {tag}
                    </Link>
                  )
                }
              })}
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
            <Dialog.Title className="px-4 pt-4 text-lg font-bold md:px-6 lg:text-xl">
              Delete note
            </Dialog.Title>
            <Dialog.Description className="p-4 pt-3 text-base-content/75 md:px-6">
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
                onClick={() => {
                  if (id) deleteNote(id)
                }}
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
