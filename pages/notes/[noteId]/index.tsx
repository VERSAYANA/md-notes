import { useRouter } from 'next/router'
import Note from '../../../components/Note'

function NotePage() {
  const router = useRouter()
  const { noteId } = router.query

  return (
    <div className="container mx-auto flex w-full flex-1 flex-col">
      <Note id={noteId as string} />
    </div>
  )
}

export default NotePage
