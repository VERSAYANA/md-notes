export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      notes: {
        Row: {
          content: string | null
          created_at: string
          id: string
          is_public: boolean
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content?: string | null
          created_at?: string
          id?: string
          is_public?: boolean
          title?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string | null
          created_at?: string
          id?: string
          is_public?: boolean
          title?: string
          updated_at?: string
          user_id?: string
        }
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          full_name: string | null
          id: string
          updated_at: string | null
          username: string | null
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          full_name?: string | null
          id: string
          updated_at?: string | null
          username?: string | null
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string | null
          username?: string | null
          website?: string | null
        }
      }
      tags: {
        Row: {
          name: string
          note_id: string
        }
        Insert: {
          name: string
          note_id: string
        }
        Update: {
          name?: string
          note_id?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_notes_by_tag: {
        Args: { p_tag_name: string }
        Returns: { id: string; note: string }[]
      }
      update_tags: {
        Args: { p_note_id: string; p_names: string[] }
        Returns: { name: string }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}
