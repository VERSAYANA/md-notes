import {
  GitHub,
  Instagram,
  Link as LinkIcon,
  Linkedin,
  Twitter,
} from 'react-feather'
import { Database } from '../utils/database.types'
import { getValidUrlFromUsernameOrUrl } from '../utils/functions'
import Avatar from './Avatar'

type Profiles = Database['public']['Tables']['profiles']['Row']

type Props = {
  profile: Profiles
}
function UserInformation({ profile }: Props) {
  return (
    <section className="flex flex-1 flex-col">
      <Avatar url={profile.avatar_url || ''} />
      <div className="mt-4 flex flex-col items-center justify-center">
        {profile.full_name && (
          <h2 className="text-2xl font-bold">{profile.full_name}</h2>
        )}
        {profile.username && (
          <p className="text-base">@{profile.username.toUpperCase()}</p>
        )}
        {profile.bio && (
          <p className="mt-3 text-base opacity-90">{profile.bio}</p>
        )}
      </div>

      <div className="my-5 flex items-center justify-center gap-2">
        {profile.twitter && (
          <button className="btn-ghost btn btn-square">
            <a
              href={`${getValidUrlFromUsernameOrUrl(
                profile.twitter,
                'https://twitter.com/'
              )}`}
              target="_blank"
              rel="noreferrer"
            >
              <Twitter size={32} />
            </a>
          </button>
        )}
        {profile.github && (
          <button className="btn-ghost btn btn-square">
            <a
              href={`${getValidUrlFromUsernameOrUrl(
                profile.github,
                'https://github.com/'
              )}`}
              target="_blank"
              rel="noreferrer"
            >
              <GitHub size={32} />
            </a>
          </button>
        )}
        {profile.linkedin && (
          <button className="btn-ghost btn btn-square">
            <a
              href={`${getValidUrlFromUsernameOrUrl(
                profile.linkedin,
                'https://www.linkedin.com/in/'
              )}`}
              target="_blank"
              rel="noreferrer"
            >
              <Linkedin size={32} />
            </a>
          </button>
        )}
        {profile.instagram && (
          <button className="btn-ghost btn btn-square">
            <a
              href={`${getValidUrlFromUsernameOrUrl(
                profile.instagram,
                'https://instagram.com/'
              )}`}
              target="_blank"
              rel="noreferrer"
            >
              <Instagram size={32} />
            </a>
          </button>
        )}
        {profile?.website && (
          <a href={profile.website}>
            <LinkIcon size={32} />
          </a>
        )}
      </div>
    </section>
  )
}

export default UserInformation
