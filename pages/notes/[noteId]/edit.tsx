import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

import EditNote from '@/components/EditNote'
import type { Database } from '@/utils/database.types'

type Note = Database['public']['Tables']['notes']['Row'] & {
  tags:
    | {
        name: string
      }
    | {
        name: string
      }[]
    | null
}

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
          .select(
            `
              *,
              tags (
                name
              )
            `
          )
          .eq('id', noteId)
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

  async function updateNoteTags(tags: string[]) {
    try {
      setIsSaving(true)
      if (tags.length > 0) {
        const { data: updatedTags, error: updateTagsError } = await supabase
          .rpc('update_tags', {
            p_note_id: noteId as string,
            p_names: tags,
          })
          .select()

        if (updateTagsError) throw updateTagsError
      } else {
        const { error: updateTagsError } = await supabase
          .from('tags')
          .delete()
          .eq('note_id', noteId as string)

        if (updateTagsError) throw updateTagsError
      }
    } catch (error) {
      console.error(error)
    } finally {
      setIsSaving(false)
    }
  }

  async function saveNote(
    title: Note['title'],
    content: Note['content'],
    isPublic: Note['is_public'],
    tags: string[]
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
        updateNoteTags(tags)
      }
      if (updateNoteError) throw updateNoteError
    } catch (error) {
      console.error(error)
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
        id={note?.id || ''}
        isLoading={isLoading}
        saveNote={saveNote}
        isSaving={isSaving}
        tags={
          (note?.tags as {
            name: string
          }[]) || []
        }
      />
    </div>
  )
}

export default EditNotePage
