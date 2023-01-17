import Head from 'next/head'
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

export default function Home() {
  const router = useRouter()

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
      <div className="container mx-auto flex justify-center"></div>
    </>
  )
}
