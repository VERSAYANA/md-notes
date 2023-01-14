import { useState, useEffect } from 'react'
import { useSupabaseClient, Session } from '@supabase/auth-helpers-react'
import { Database } from '../utils/database.types'
import Avatar from './Avatar'
import { useForm, SubmitHandler } from 'react-hook-form'
import Link from 'next/link'
type Profiles = Database['public']['Tables']['profiles']['Row']

type ProfileInputs = {
  username: string
  website: string
  fullName: string
  twitter: string
  github: string
  instagram: string
  tiktok: string
  linkedin: string
}

export default function Account({ session }: { session: Session }) {
  const supabase = useSupabaseClient<Database>()
  const { user } = session
  const [loading, setLoading] = useState(true)
  const [username, setUsername] = useState<Profiles['username']>(null)
  const [avatar_url, setAvatarUrl] = useState<Profiles['avatar_url']>(null)
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ProfileInputs>()
  const onSubmit: SubmitHandler<ProfileInputs> = (formData) =>
    updateProfile({
      username: formData.username,
      website: formData.website,
      avatar_url: avatar_url,
      full_name: formData.fullName,
      github: formData.github,
      twitter: formData.twitter,
      instagram: formData.instagram,
      tiktok: formData.tiktok,
      linkedin: formData.linkedin,
    })
  const formData = watch()

  useEffect(() => {
    async function getProfile() {
      try {
        setLoading(true)
        if (!user) throw new Error('No user')

        let { data, error, status } = await supabase
          .from('profiles')
          .select(
            `username, website, avatar_url, full_name, twitter, github, instagram, tiktok, linkedin`
          )
          .eq('id', user.id)
          .single()

        if (error && status !== 406) {
          throw error
        }

        if (data) {
          // setUsername(data.username)
          console.log(data.username)
          console.log(formData.username)

          setValue('username', data.username || '')
          setValue('website', data.website || '')
          setValue('fullName', data.full_name || '')
          setValue('twitter', data.twitter || '')
          setValue('github', data.github || '')
          setValue('instagram', data.instagram || '')
          setValue('tiktok', data.tiktok || '')
          setValue('linkedin', data.linkedin || '')

          setAvatarUrl(data.avatar_url)
        }
      } catch (error) {
        alert('Error loading user data!')
        console.log(error)
      } finally {
        setLoading(false)
      }
    }
    if (user) {
      getProfile()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session])

  async function updateProfile({
    username,
    website,
    avatar_url,
    full_name,
    twitter,
    github,
    instagram,
    tiktok,
    linkedin,
  }: {
    username: Profiles['username']
    website: Profiles['website']
    avatar_url: Profiles['avatar_url']
    full_name: Profiles['full_name']
    twitter: Profiles['twitter']
    github: Profiles['github']
    instagram: Profiles['instagram']
    tiktok: Profiles['tiktok']
    linkedin: Profiles['linkedin']
  }) {
    try {
      setLoading(true)
      if (!user) throw new Error('No user')

      const updates = {
        id: user.id,
        username: username?.toLocaleLowerCase(),
        website,
        avatar_url,
        updated_at: new Date().toISOString(),
        full_name,
        twitter,
        github,
        instagram,
        tiktok,
        linkedin,
      }

      let { error } = await supabase.from('profiles').upsert(updates)
      if (error) throw error
      alert('Profile updated!')
    } catch (error) {
      alert('Error updating the data!')
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex w-full flex-col">
      {user ? (
        <Avatar
          uid={user.id}
          url={avatar_url}
          size={150}
          onUpload={(url) => {
            setAvatarUrl(url)
            updateProfile({
              username: formData.username,
              website: formData.website,
              avatar_url: url,
              full_name: formData.fullName,
              github: formData.github,
              twitter: formData.twitter,
              instagram: formData.instagram,
              tiktok: formData.tiktok,
              linkedin: formData.linkedin,
            })
          }}
        />
      ) : null}
      <div>
        <label htmlFor="email" className="label">
          <span className="label-text">Email</span>
        </label>
        <input
          className="input-bordered input w-full disabled:bg-base-300"
          id="email"
          type="text"
          value={session.user.email}
          disabled
        />
      </div>
      <div>
        <label htmlFor="username" className="label">
          <span className="label-text">Username</span>
        </label>
        <input
          {...register('username')}
          disabled={!!formData.username}
          className={`input-bordered input w-full disabled:bg-base-300`}
          id="username"
          type="text"
        />
      </div>

      <div>
        <label htmlFor="fullName" className="label">
          <span className="label-text">Full Name</span>
        </label>
        <input
          {...register('fullName')}
          className="input-bordered input w-full"
          id="fullName"
          type="fullName"
        />
      </div>
      <div>
        <label htmlFor="website" className="label">
          <span className="label-text">Website</span>
        </label>
        <input
          {...register('website')}
          className="input-bordered input w-full"
          id="website"
          type="website"
        />
      </div>
      <div>
        <label htmlFor="twitter" className="label">
          <span className="label-text">Twitter</span>
        </label>
        <input
          {...register('twitter')}
          className="input-bordered input w-full"
          id="twitter"
          type="twitter"
        />
      </div>
      <div>
        <label htmlFor="github" className="label">
          <span className="label-text">Github</span>
        </label>
        <input
          {...register('github')}
          className="input-bordered input w-full"
          id="github"
          type="github"
        />
      </div>
      <div>
        <label htmlFor="instagram" className="label">
          <span className="label-text">Instagram</span>
        </label>
        <input
          {...register('instagram')}
          className="input-bordered input w-full"
          id="instagram"
          type="instagram"
        />
      </div>
      <div>
        <label htmlFor="tiktok" className="label">
          <span className="label-text">TikTok</span>
        </label>
        <input
          {...register('tiktok')}
          className="input-bordered input w-full"
          id="tiktok"
          type="tiktok"
        />
      </div>
      <div>
        <label htmlFor="linkedin" className="label">
          <span className="label-text">Linkedin</span>
        </label>
        <input
          {...register('linkedin')}
          className="input-bordered input w-full"
          id="linkedin"
          type="linkedin"
        />
      </div>

      <div className="my-4 flex justify-end gap-x-2">
        <div>
          {/* <button
            className="btn-warning btn w-full"
            onClick={() => supabase.auth.signOut()}
          >
            Sign Out
          </button> */}
          <Link
            href={`/${formData.username}`}
            className="btn-warning btn w-full normal-case"
          >
            Visit Profile
          </Link>
        </div>
        <div>
          <button
            className={`btn-accent btn w-full normal-case ${
              loading ? 'loading' : ''
            }`}
            type="submit"
            disabled={loading}
          >
            {loading ? 'Saving ...' : 'Save'}
          </button>
        </div>
      </div>
    </form>
  )
}
