import {
  useSession,
  useSupabaseClient,
  useUser,
} from '@supabase/auth-helpers-react'
import { useEffect, useState } from 'react'
import { Database } from '../../utils/database.types'
import { useRouter } from 'next/router'

type Profiles = Database['public']['Tables']['profiles']['Row']

function NewNote() {
  const user = useUser()
  const session = useSession()
  const supabase = useSupabaseClient<Database>()
  const router = useRouter()
  const [username, setUsername] = useState<Profiles['username']>(null)
  const [usernameInputValue, setUsernameInputValue] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  console.log(user)
  console.log(session)

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
        setIsLoading(true)
      }
    }

    getUsername()
  }, [user, supabase])

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/auth')
    }
  }, [isLoading, user, router])

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

  if (isLoading) {
    return (
      <div className="flex w-full flex-1 items-center justify-center">
        <p>Loading</p>
      </div>
    )
  }

  if (!username) {
    return (
      <div className="container mx-auto flex h-full items-center justify-center p-4">
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
    <div>
      <h2>New Note</h2>
    </div>
  )
}

export default NewNote
