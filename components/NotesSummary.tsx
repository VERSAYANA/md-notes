import Link from 'next/link'
import { Eye, Lock } from 'react-feather'
import { useRouter } from 'next/router'

import Avatar from './Avatar'
import type { NoteSummary } from '@/utils/types'
import dayjs from '@/utils/dayjs'

type Props = {
  notes: NoteSummary[]
  showPublicPrivateIcon?: boolean
}

function NotesSummary({
  notes,
  showPublicPrivateIcon: showPublicPrivate = false,
}: Props) {
  return (
    <div className="container mx-auto flex h-full w-full max-w-4xl flex-col gap-y-8">
      {notes.map((note) => (
        <div
          key={note.id}
          className="flex flex-col gap-y-4 rounded-lg bg-base-100 p-4 shadow hover:shadow-md md:p-6"
        >
          <div className="flex items-center gap-x-4">
            <Link
              href={`/${note.username ? note.username : ''}`}
              className="flex h-12 gap-x-3 md:gap-x-4"
            >
              <Avatar url={note.avatar_url || ''} height={48} width={48} />
              <span className="flex h-full items-center text-base md:text-lg">
                {note.full_name ? note.full_name : note.username || ''}
              </span>
            </Link>
            <p className="flex h-full flex-1 items-center justify-end opacity-70">
              {dayjs(note.updated_at).fromNow(true)} ago
            </p>
          </div>
          <Link
            href={`/notes/${note.id}`}
            className="flex items-center justify-between py-3"
          >
            <h2 className="flex flex-wrap text-lg font-bold md:text-xl">
              {note.title}
            </h2>
            {showPublicPrivate && (
              <div className="flex px-2">
                {note.is_public ? <Eye /> : <Lock />}
              </div>
            )}
          </Link>

          <div className="flex justify-between">
            <div className="flex flex-wrap items-center gap-2">
              {note.tags.map(
                (tag) =>
                  tag && (
                    <Link
                      href={`/tag/${tag}`}
                      key={tag}
                      className="flex rounded-full bg-base-200 px-4 py-2 shadow hover:shadow-md"
                    >
                      {tag}
                    </Link>
                  )
              )}
            </div>
            <Link
              className="flex flex-1 justify-end"
              href={`/notes/${note.id}`}
            >
              <button className="btn normal-case hover:shadow-md">
                Read note
              </button>
            </Link>
          </div>
        </div>
      ))}
    </div>
  )
}

export default NotesSummary
