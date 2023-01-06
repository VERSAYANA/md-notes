import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Database } from '../utils/database.types'
import { UserNoteSummary } from '../utils/types'
type Notes = Database['public']['Tables']['notes']['Row']

type Props = {
  notes: UserNoteSummary[]
}

function Notes({ notes }: Props) {
  console.log(notes)

  return (
    <div className="container mx-auto flex w-full max-w-5xl flex-1 flex-col gap-y-8">
      {notes.map((note) => (
        <div
          key={note.id}
          className="flex flex-col rounded-lg bg-base-100 p-4 shadow"
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
