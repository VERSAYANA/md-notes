/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from 'react'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { Database } from '../utils/database.types'
type Profiles = Database['public']['Tables']['profiles']['Row']

export default function Avatar({
  uid,
  url,
  size,
  width = 240,
  height = 240,
  onUpload,
}: {
  uid?: string
  url: Profiles['avatar_url']
  size?: number
  width?: number
  height?: number
  onUpload?: (url: string) => void
}) {
  const supabase = useSupabaseClient<Database>()
  const [avatarUrl, setAvatarUrl] = useState<Profiles['avatar_url']>(null)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    async function downloadImage(path: string) {
      try {
        const { data, error } = await supabase.storage
          .from('avatars')
          .download(path)
        if (error) {
          throw error
        }
        const url = URL.createObjectURL(data)
        setAvatarUrl(url)
      } catch (error) {
        console.log('Error downloading image: ', error)
      }
    }
    if (url) downloadImage(url)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url])

  const uploadAvatar: React.ChangeEventHandler<HTMLInputElement> = async (
    event
  ) => {
    try {
      setUploading(true)

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.')
      }

      const file = event.target.files[0]
      const fileExt = file.name.split('.').pop()
      const fileName = `${uid}.${fileExt}`
      const filePath = `${fileName}`

      let { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true })

      if (uploadError) {
        throw uploadError
      }
      if (onUpload) {
        onUpload(filePath)
      }
    } catch (error) {
      console.log('error')
      // alert('Error uploading avatar!')
      console.log(error)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center">
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt="Avatar"
          className="avatar rounded-full"
          width={width}
          height={height}
        />
      ) : (
        <div className="placeholder avatar">
          <div
            className="rounded-full bg-neutral-focus text-neutral-content"
            style={{ width: width }}
          >
            <span className={`${width < 48 ? 'text-xs' : 'text-3xl'}`}>
              {width < 48 ? 'You' : 'Profile Picture'}
            </span>
          </div>
        </div>
      )}
      {uid ? (
        <div className="my-4 w-60">
          <label className="btn-secondary btn w-full" htmlFor="single">
            {uploading ? 'Uploading ...' : 'Upload'}
          </label>
          <input
            className="hidden"
            type="file"
            id="single"
            accept="image/*"
            onChange={uploadAvatar}
            disabled={uploading}
          />
        </div>
      ) : null}
    </div>
  )
}
