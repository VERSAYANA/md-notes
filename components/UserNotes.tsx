import Link from 'next/link'
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
          className="flex flex-col rounded-lg bg-base-100 p-4 shadow"
        >
          <h2 className="text-xl font-bold">{note.title}</h2>
          <p>{new Date(note.updated_at).toLocaleDateString()}</p>
          <div className="flex justify-end">
            <Link className="btn flex" href={`/notes/${note.id}`}>
              Open note
            </Link>
          </div>
        </Link>
      ))}
    </div>
  )
}

export default Notes
