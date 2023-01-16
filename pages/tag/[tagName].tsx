import { GetServerSideProps } from 'next'
import { ParsedUrlQuery } from 'querystring'
import NotesSummary from '../../components/NotesSummary'
import { supabase } from '../../utils/supabase'
import { NoteSummary } from '../../utils/types'

type Props = {
  notes: NoteSummary[]
}

interface IParams extends ParsedUrlQuery {
  tagName: string
}

function TagNotes({ notes }: Props) {
  return (
    <div className="containter flex w-full flex-1 flex-col items-center justify-center p-4 md:p-8">
      <NotesSummary notes={notes} />
    </div>
  )
}

export default TagNotes

export const getServerSideProps: GetServerSideProps<{
  notes: NoteSummary[]
}> = async (context) => {
  const { tagName } = context.params as IParams
  const { data: notes, error } = await supabase
    .rpc('get_notes_by_tag_name', {
      tag_name: tagName,
    })
    .select()
    .order('updated_at', { ascending: false })

  if (error) throw error

  return {
    props: {
      notes: notes || [],
    },
  }
}
