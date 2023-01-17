import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react'
import { Auth, ThemeSupa } from '@supabase/auth-ui-react'
import Head from 'next/head'
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
    <>
      <Head>
        <title>Sign In / Sign Up</title>
      </Head>
      <div className="container mx-auto flex justify-center">
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
      </div>
    </>
  )
}

export default AuthPage
