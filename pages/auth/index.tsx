import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react'
import { Auth, ThemeSupa } from '@supabase/auth-ui-react'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

function AuthPage() {
  const session = useSession()
  const supabase = useSupabaseClient()
  const router = useRouter()

  useEffect(() => {
    if (session?.user) {
      router.push('/')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session])

  return (
    <main className="container mx-auto flex justify-center">
      <div className="flex w-full max-w-2xl items-center justify-center p-4">
        {!session ? (
          <div className="w-full">
            <Auth
              supabaseClient={supabase}
              appearance={{
                theme: ThemeSupa,
              }}
              theme="default"
            />
          </div>
        ) : null}
      </div>
    </main>
  )
}

export default AuthPage
