export type NoteSummary = {
  id: string
  title: string
  is_public: boolean
  updated_at?: string
  created_at?: string
  tags: string[]
  user_id?: string
  username?: string
  full_name?: string
  avatar_url?: string
}

export type Note = {
  id: string
  title: string
  content: string
  is_public: boolean
  updated_at: string
  created_at: string
  tags: string[]
  user_id: string
  username: string
  full_name: string
  avatar_url: string
} | null

export type ToastType = '' | 'info' | 'success' | 'warning' | 'error'

export type ToastDetails = {
  hidden: boolean
  message: string
  type: ToastType
}

export type GetNotesAPIResult = ({
  id: string
} & {
  updated_at: string
} & {
  title: string
} & {
  is_public: boolean
} & {
  tags:
    | {
        name: string
      }
    | {
        name: string
      }[]
    | null
})[]
