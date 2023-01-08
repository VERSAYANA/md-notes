import Link from 'next/link'
import { Eye, Lock } from 'react-feather'
import { Database } from '../utils/database.types'
import { UserNoteSummary } from '../utils/types'
type Notes = Database['public']['Tables']['notes']['Row']

type Props = {
  notes: UserNoteSummary[]
}

function Notes({ notes }: Props) {
  return (
    <div className="container mx-auto flex w-full max-w-5xl flex-1 flex-col gap-y-8">
      {notes.map((note) => (
        <Link
          href={`/notes/${note.id}`}
          key={note.id}
          className="flex flex-col rounded-lg bg-base-100 p-4 shadow hover:shadow-lg"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">{note.title}</h2>
            <div className="flex">{note.is_public ? <Eye /> : <Lock />}</div>
          </div>
          <p>{new Date(note.updated_at).toLocaleDateString()}</p>
          <div className="flex justify-end">
            <button className="btn flex">Open note</button>
          </div>
        </Link>
      ))}
    </div>
  )
}

export default Notes
