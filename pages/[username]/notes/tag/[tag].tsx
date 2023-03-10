import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Head from 'next/head'

import NotesSummary from '@/components/NotesSummary'
import type { Database } from '@/utils/database.types'
import type { NoteSummary } from '@/utils/types'

function UserNotesByTagPage() {
  const router = useRouter()
  const tag = router.query.tag as string
  const username = router.query.username as string

  const [notes, setNotes] = useState<NoteSummary[]>([])
  const supabase = useSupabaseClient<Database>()

  async function getNotesByUsernameAndTag(username: string, tag: string) {
    try {
      const { data: notes, error } = await supabase
        .rpc('get_notes_by_username_and_tag', {
          p_username: username,
          tag_name: tag,
        })
        .select()
        .order('updated_at', { ascending: false })

      if (error) throw error
      if (notes) setNotes(notes)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    if (username && tag) getNotesByUsernameAndTag(username, tag)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username, tag])

  return (
    <>
      <Head>
        <title>
          {tag && username ? `${tag} - ${username.toUpperCase()}` : `Tag`}
        </title>
      </Head>
      <div className="containter flex w-full flex-1 flex-col items-center justify-center p-4 md:p-8">
        <NotesSummary notes={notes} showPublicPrivateIcon={true} />
      </div>
    </>
  )
}

export default UserNotesByTagPage
