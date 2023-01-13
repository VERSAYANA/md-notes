import Link from 'next/link'
import { Eye, Lock } from 'react-feather'
import { Database } from '../utils/database.types'
import type { NoteSummary } from '../utils/types'
type Notes = Database['public']['Tables']['notes']['Row']
import { tagsToArray, tagsToSet } from '../utils/functions'
import { useRouter } from 'next/router'

type Props = {
  notes: NoteSummary[]
}

function Notes({ notes }: Props) {
  const router = useRouter()
  return (
    <div className="container mx-auto flex w-full max-w-4xl flex-1 flex-col gap-y-8">
      {notes.map((note) => (
        <Link
          href={`/notes/${note.id}`}
          key={note.id}
          className="flex flex-col gap-y-4 rounded-lg bg-base-100 p-4 shadow hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">{note.title}</h2>
            <div className="flex">{note.is_public ? <Eye /> : <Lock />}</div>
          </div>
          <p>{new Date(note.updated_at).toLocaleDateString()}</p>
          {/* <div className="flex justify-end">
            <button className="btn flex">Open note</button>
          </div> */}
          <div className="flex flex-wrap items-center gap-2">
            {note.tags.map((tag) => (
              <button
                key={tag}
                onClick={() => router.push(`/tag/${tag}`)}
                className="flex rounded-full bg-base-200 px-4 py-2 shadow hover:shadow-md"
              >
                {tag}
              </button>
            ))}
          </div>
        </Link>
      ))}
    </div>
  )
}

export default Notes
