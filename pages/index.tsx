import Head from 'next/head'
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

export default function Home() {
  const router = useRouter()
  const session = useSession()
  const supabase = useSupabaseClient()

  // useEffect(() => {
  //   async function getUsername() {
  //     try {
  //       if (!session?.user) throw new Error('No user')

  //       let { data, error, status } = await supabase
  //         .from('profiles')
  //         .select(`username`)
  //         .eq('id', session?.user.id)
  //         .single()

  //       if (error && status !== 406) {
  //         throw error
  //       }
  //       if (data) {
  //         router.push(`/${data.username}/notes`)
  //       }
  //     } catch (error) {
  //       console.error(error)
  //     }
  //   }
  //   if (session?.user) {
  //     getUsername()
  //   }
  // }, [session])
  useEffect(() => {
    if (router) {
      router.push('/notes/new')
    }
  }, [router])

  return (
    <>
      <Head>
        <title>Markdown Notes</title>
      </Head>
      <div className="container mx-auto flex justify-center">
        {/* <div className="flex w-full max-w-4xl items-center justify-center p-4">
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
        </div> */}
      </div>
    </>
  )
}
