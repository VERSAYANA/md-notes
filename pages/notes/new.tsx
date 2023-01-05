import {
  useSession,
  useSupabaseClient,
  useUser,
} from '@supabase/auth-helpers-react'
import { useEffect, useState } from 'react'
import { Database } from '../../utils/database.types'
import { useRouter } from 'next/router'

type Profiles = Database['public']['Tables']['profiles']['Row']
type Notes = Database['public']['Tables']['notes']['Row']

function NewNote() {
  const user = useUser()
  const session = useSession()
  const supabase = useSupabaseClient<Database>()
  const router = useRouter()
  const [username, setUsername] = useState<Profiles['username']>(null)
  const [usernameInputValue, setUsernameInputValue] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [content, setContent] = useState('')
  const [title, setTitle] = useState('')
  console.log(content)
  // console.log(session)

  useEffect(() => {
    async function getUsername() {
      try {
        setIsLoading(true)
        if (!user) throw new Error('No user')

        let { data, error, status } = await supabase
          .from('profiles')
          .select(`username`)
          .eq('id', user.id)
          .single()

        if (error && status !== 406) {
          throw error
        }
        if (data) {
          setUsername(data.username)
        }
      } catch (error) {
        console.log(error)
      } finally {
        setIsLoading(false)
      }
    }

    getUsername()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/auth')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  async function submitUsername(username: Profiles['username']) {
    try {
      setIsSubmitting(true)
      if (!user) throw new Error('No user')

      let { error } = await supabase
        .from('profiles')
        .update({ username })
        .eq('id', user.id)

      if (error) throw error
    } catch (error) {
      console.log(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  async function saveNote(title: Notes['title'], content: Notes['content']) {
    try {
      setIsSubmitting(true)
      if (!user) throw new Error('No user')

      console.log(content)

      let { error, data } = await supabase.from('notes').insert({
        user_id: user.id,
        content,
        title,
      })

      console.log(data)

      if (error) throw error
    } catch (error) {
      console.log(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // if (isLoading) {
  //   return (
  //     <div className="flex w-full flex-1 items-center justify-center">
  //       <p>Loading</p>
  //     </div>
  //   )
  // }

  if (!username) {
    return (
      <div className="container mx-auto flex flex-1 items-center justify-center p-4">
        <div className="flex w-full max-w-2xl items-end justify-center gap-2">
          <div className="flex-1">
            <label htmlFor="username" className="label">
              <span className="label-text">Username</span>
            </label>
            <input
              className="input-bordered input w-full"
              id="username"
              type="text"
              value={usernameInputValue || ''}
              onChange={(e) => setUsernameInputValue(e.target.value)}
            />
          </div>
          <div>
            <button
              className={`btn-accent btn w-full ${
                isSubmitting ? 'loading' : ''
              }`}
              onClick={() => submitUsername(usernameInputValue.toLowerCase())}
              disabled={isSubmitting}
            >
              {isSubmitting ? '' : 'Submit'}
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto flex flex-1 flex-col gap-y-4 p-4">
      <div className="flex gap-x-4">
        <input
          className="input-bordered input flex-1"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button
          onClick={() => saveNote(title, content)}
          className="btn-accent btn"
        >
          Save
        </button>
      </div>
      <textarea
        onChange={(e) => setContent(e.target.value)}
        value={content}
        placeholder="Note"
        className="textarea-bordered textarea flex-1"
      />
    </div>
  )
}

export default NewNote
