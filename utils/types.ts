export type NoteSummary = {
  id: string
  title: string
  updated_at: string
  is_public: boolean
  tags: string[]
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
