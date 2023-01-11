export type UserNoteSummary = {
  id: string
  title: string
  updated_at: string
  is_public: boolean
  tags:
    | {
        name: string
      }
    | {
        name: string
      }[]
    | null
}
