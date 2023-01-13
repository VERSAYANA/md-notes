import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { useRouter } from 'next/router'
import { ParsedUrlQuery } from 'querystring'
import { useEffect, useState } from 'react'
import Notes from '../../components/UserNotes'
import { Database } from '../../utils/database.types'
import { supabase } from '../../utils/supabase'
import { NoteSummary } from '../../utils/types'

type Props = {
  data: NoteSummary[]
}

interface IParams extends ParsedUrlQuery {
  tagName: string
}

function TagNotes() {
  const router = useRouter()
  const { tagName } = router.query
  const supabase = useSupabaseClient<Database>()
  const [notes, setNotes] = useState<NoteSummary[]>([])

  useEffect(() => {
    if (tagName) getTagNotes(tagName as string)
  }, [tagName])

  async function getTagNotes(tagName: string) {
    try {
      const { data: notes, error } = await supabase
        .rpc('get_notes_by_tag', {
          p_tag_name: tagName,
        })
        .select()
      // const { data, error } = await supabase.from('tags').select('*, notes(id)').eq('name', '')
      // .eq('tags.name', 'fun')

      console.log(notes)

      if (error) throw error

      if (notes) setNotes(notes)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="containter flex w-full flex-1 flex-col items-center justify-center p-4 md:p-8">
      <Notes notes={notes} />
    </div>
  )
}

export default TagNotes

// export const getServerSideProps: GetServerSideProps<{
//   data: UserNoteSummary[]
// }> = async (context) => {
//   const { tagName } = context.params as IParams
//   const { data: notes, error } = await supabase
//     .rpc('get_notes_by_tag', {
//       p_tag_name: tagName,
//     })
//     .select()

//   console.log(notes)
//   const { data, error } = await supabase.from('notes').select(`
//     id,
//     tags (
//       note_id
//     )
//   `)
// .eq('tags(name)', tagName)
// console.log(data)

// let { data: noteIds, error, status } = await supabase.from("tags").select('note_id').eq('name', tagName)
// if (error && status !== 406) {
//   throw error
// }
// if (noteIds) {
//   let {} = await supabase          .from('notes')
//   .select(
//     `
// id, updated_at, title, is_public,
// tags (
//   name
// )
// `).eq('id')
// }
// let { data, error, status } = await supabase
//   .rpc('get_notes_by_tag', {
//     p_tag_name: tagName,
//   })
//   .select()
// if (error) throw error

// console.log(tagName)

// const { data, error } = await supabase.rpc('get_notes_by_tag', {
//   p_tag_name: tagName,
// })
// console.log(data)

// console.log('datalenght', data?.length)

// return {
//   props: {
//     data: notes || [],
//   },
// }

// console.log()
// }
