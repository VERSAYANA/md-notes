import type { GetServerSideProps } from 'next'
import { ParsedUrlQuery } from 'querystring'
import Notes from '../../components/UserNotes'
import { supabase } from '../../utils/supabase'
import { UserNoteSummary } from '../../utils/types'

type Props = {
  data: UserNoteSummary[]
}

interface IParams extends ParsedUrlQuery {
  tagName: string
}

function TagNotes({ data }: Props) {
  return (
    <div className="containter flex w-full flex-1 flex-col items-center justify-center p-4 md:p-8">
      <Notes notes={data} />
    </div>
  )
}

export default TagNotes

export const getServerSideProps: GetServerSideProps<{
  data:
    | ({
        id: string
      } & {
        updated_at: string
      } & {
        title: string
      } & {
        is_public: boolean
      } & {
        tags:
          | {
              name: string
            }
          | {
              name: string
            }[]
          | null
      })[]
    | null
}> = async (context) => {
  const { tagName } = context.params as IParams

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

  const { data, error } = await supabase
    .from('notes')
    .select('id, updated_at, title, is_public, tags(name)')
    .eq('tags.name', tagName)

  console.log(data)

  return {
    props: {
      data,
    },
  }

  // console.log(data)
}
