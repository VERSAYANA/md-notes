import {
  useSession,
  useSupabaseClient,
  useUser,
} from '@supabase/auth-helpers-react'
import { useEffect, useState } from 'react'
import { Database } from '../../utils/database.types'
import { useRouter } from 'next/router'
import EditNote from '../../components/EditNote'

type Profiles = Database['public']['Tables']['profiles']['Row']
type Notes = Database['public']['Tables']['notes']['Row']

function NewNote() {
  const user = useUser()
  const supabase = useSupabaseClient<Database>()
  const router = useRouter()
  const [username, setUsername] = useState<Profiles['username']>(null)
  const [usernameInputValue, setUsernameInputValue] = useState<string>('')
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

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
    if (user) {
      getUsername()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/auth')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  console.log(user)

  async function submitUsername(username: Profiles['username']) {
    try {
      setIsSaving(true)
      if (!user) throw new Error('No user')

      let { error } = await supabase
        .from('profiles')
        .update({ username })
        .eq('id', user.id)

      if (error) throw error
    } catch (error) {
      console.log(error)
    } finally {
      setIsSaving(false)
    }
  }

  async function saveNote(
    title: Notes['title'],
    content: Notes['content'],
    isPublic: Notes['is_public']
  ) {
    try {
      setIsSaving(true)
      if (!user) throw new Error('No user')
      let { error, data } = await supabase
        .from('notes')
        .insert({
          user_id: user.id,
          content,
          title,
          is_public: isPublic,
        })
        .select()
        .single()

      if (error) {
        throw error
      }
      if (data) {
        router.push(`/notes/${data.id}`)
      }
    } catch (error) {
      console.log(error)
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex w-full flex-1 items-center justify-center">
        <p>Loading</p>
      </div>
    )
  }

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
              className={`btn-accent btn w-full ${isSaving ? 'loading' : ''}`}
              onClick={() => submitUsername(usernameInputValue.toLowerCase())}
              disabled={isSaving}
            >
              {isSaving ? '' : 'Submit'}
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto flex flex-1 flex-col px-4 py-4 md:py-6">
      <EditNote saveNote={saveNote} isSaving={isSaving} isPublic={false} />
    </div>
  )
}

export default NewNote
