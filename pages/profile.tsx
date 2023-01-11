import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import Account from '../components/Account'

function Profile() {
  const session = useSession()
  const supabase = useSupabaseClient()
  const router = useRouter()

  useEffect(() => {
    async function getUser() {
      const { data, error } = await supabase.auth.getUser()
      if (!data || error) {
        router.push('/auth')
      }
    }
    getUser()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (session) {
    return (
      <div className="container mx-auto flex max-w-4xl flex-1 flex-col p-4 pt-8">
        <Account session={session} />
      </div>
    )
  } else {
    return null
  }
}

export default Profile
