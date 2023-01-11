import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import EditNote from '../../../components/EditNote'
import { Database } from '../../../utils/database.types'
type Note = Database['public']['Tables']['notes']['Row']

function EditNotePage() {
  const supabase = useSupabaseClient<Database>()
  const user = useUser()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [note, setNote] = useState<Note>()
  const { noteId } = router.query

  useEffect(() => {
    async function getNote() {
      try {
        setIsLoading(true)
        const { data, error, status } = await supabase
          .from('notes')
          .select('*')
          .eq('id', noteId)
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

    if (noteId) {
      getNote()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [noteId])

  const tags = ['typescript', 'leetcode', 'fun']
  const dataTags: { name: string; note_id: string }[] = []
  for (const tag of tags) {
    dataTags.push({ name: tag.toLowerCase(), note_id: noteId as string })
  }

  async function updateNoteTags() {
    try {
      const { data: updatedTags, error: updateTagsError } = await supabase
        .rpc('update_tags', {
          p_note_id: noteId as string,
          p_names: tags,
        })
        .select()

      console.log(updatedTags)

      // const { data: tags, error: upsertTagsError } = await supabase
      //   .from('tags')
      //   .upsert(dataTags)
      //   .select()
      // console.log(tags)

      // if (upsertTagsError) throw upsertTagsError

      // console.log(tags)

      // const noteTagsData: { note_id: string; tag_id: string }[] = []
      // for (const tag of tags) {
      //   noteTagsData.push({ note_id: noteId as string, tag_id: tag.id })
      // }

      // const { data: noteTags, error: upsertNoteTagsError } = await supabase
      //   .from('note_tags')
      //   .upsert(noteTagsData)
      //   .select()

      if (updateTagsError) throw updateTagsError
    } catch (error) {
      console.error(error)
    }
  }

  async function saveNote(
    title: Note['title'],
    content: Note['content'],
    isPublic: Note['is_public']
  ) {
    try {
      setIsSaving(true)
      if (!user) throw new Error('No user')
      const { data: updatedNote, error: updateNoteError } = await supabase
        .from('notes')
        .update({
          title,
          content,
          is_public: isPublic,
        })
        .eq('id', noteId)
        .select()
        .single()

      if (updatedNote) {
        updateNoteTags()
      }
      if (updateNoteError) throw updateNoteError
    } catch (error) {
      console.log(error)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="container mx-auto flex flex-1 flex-col px-4 py-4 md:py-6">
      <EditNote
        title={note?.title ? note?.title : ''}
        content={note?.content ? note?.content : ''}
        isPublic={note?.is_public ? note?.is_public : false}
        isLoading={isLoading}
        saveNote={saveNote}
        isSaving={isSaving}
      />
    </div>
  )
}

export default EditNotePage
