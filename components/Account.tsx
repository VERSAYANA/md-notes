import { useState, useEffect } from 'react'
import { useSupabaseClient, Session } from '@supabase/auth-helpers-react'
import { useForm, SubmitHandler } from 'react-hook-form'
import Link from 'next/link'

import Avatar from './Avatar'
import type { Database } from '@/utils/database.types'
import { createUsername } from '@/utils/functions'
import { ToastDetails } from '@/utils/types'

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
  bio: string
}

export default function Account({ session }: { session: Session }) {
  const supabase = useSupabaseClient<Database>()
  const { user } = session
  const [loading, setLoading] = useState(true)
  const [dbUsername, setDbUsername] = useState<Profiles['username']>(null)
  const [username, setUsername] = useState<string>('')
  const [avatar_url, setAvatarUrl] = useState<Profiles['avatar_url']>(null)
  const [toast, setToast] = useState<ToastDetails>({
    hidden: true,
    message: '',
    type: '',
  })
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
      avatar_url: avatar_url || '',
      full_name: formData.fullName,
      github: formData.github,
      twitter: formData.twitter,
      instagram: formData.instagram,
      tiktok: formData.tiktok,
      linkedin: formData.linkedin,
      bio: formData.bio,
    })
  const formData = watch()

  const toggleToast = (toastDetails: ToastDetails) => {
    setToast(toastDetails)
    setTimeout(() => setToast({ hidden: true, message: '', type: '' }), 1500)
  }

  async function getProfile() {
    try {
      setLoading(true)
      if (!user) throw new Error('No user')

      let { data, error, status } = await supabase
        .from('profiles')
        .select(
          `username, website, avatar_url, full_name, twitter, github, instagram, tiktok, linkedin, bio`
        )
        .eq('id', user.id)
        .single()

      if (error && status !== 406) {
        throw error
      }

      if (data) {
        setValue('username', data.username || '')
        setValue('website', data.website || '')
        setValue('fullName', data.full_name || '')
        setValue('twitter', data.twitter || '')
        setValue('github', data.github || '')
        setValue('instagram', data.instagram || '')
        setValue('tiktok', data.tiktok || '')
        setValue('linkedin', data.linkedin || '')
        setValue('bio', data.bio || '')
        setAvatarUrl(data.avatar_url)
        setDbUsername(data.username || '')
        setUsername(data.username || '')
      }
    } catch (error) {
      toggleToast({
        message: 'Error loading user data!',
        type: 'error',
        hidden: false,
      })
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
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
    bio,
  }: {
    username: string
    website: string
    avatar_url: string
    full_name: string
    twitter: string
    github: string
    instagram: string
    tiktok: string
    linkedin: string
    bio: string
  }) {
    try {
      setLoading(true)
      if (!user) throw new Error('No user')

      const updates = {
        id: user.id,
        username: createUsername(username),
        website,
        avatar_url,
        updated_at: new Date().toISOString(),
        full_name,
        twitter,
        github,
        instagram,
        tiktok,
        linkedin,
        bio,
      }

      let { error } = await supabase.from('profiles').upsert(updates)
      if (error) throw error
      toggleToast({
        message: 'Profile updated!',
        type: 'success',
        hidden: false,
      })
      getProfile()
    } catch (error) {
      toggleToast({
        message: 'Error updating the data!',
        type: 'error',
        hidden: false,
      })
      console.error(error)
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
              username: createUsername(username),
              website: formData.website,
              avatar_url: url,
              full_name: formData.fullName,
              github: formData.github,
              twitter: formData.twitter,
              instagram: formData.instagram,
              tiktok: formData.tiktok,
              linkedin: formData.linkedin,
              bio: formData.bio,
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
          value={username}
          onChange={(e) => setUsername(createUsername(e.target.value))}
          disabled={!!dbUsername}
          className={`input-bordered input-accent input w-full disabled:bg-base-300`}
          id="username"
          type="text"
          minLength={3}
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
        <label htmlFor="bio" className="label">
          <span className="label-text">Bio</span>
        </label>
        <input
          {...register('bio')}
          className="input-bordered input w-full"
          id="bio"
          type="bio"
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
        {dbUsername && (
          <div>
            <Link
              href={`/${dbUsername}`}
              className="btn-warning btn w-full normal-case"
            >
              Visit Profile
            </Link>
          </div>
        )}

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
      <div
        className={`toast-center toast toast-top z-10 w-80 text-center md:toast-bottom ${
          toast.hidden ? 'hidden' : ''
        }`}
      >
        <div className={`alert shadow-lg alert-${toast.type}`}>
          <div className="flex w-full items-center">
            <span className="w-full">{toast.message}</span>
          </div>
        </div>
      </div>
    </form>
  )
}
