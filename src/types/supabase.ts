export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          nickname: string | null
          created_at: string
        }
        Insert: {
          id: string
          nickname?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          nickname?: string | null
          created_at?: string
        }
        Relationships: []
      }
      posts: {
        Row: {
          id: string
          user_id: string
          board: string
          category: string
          title: string
          content: string | null
          youtube_url: string | null
          thumbnail_url: string | null
          views: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          board: string
          category?: string
          title: string
          content?: string | null
          youtube_url?: string | null
          thumbnail_url?: string | null
          views?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          board?: string
          category?: string
          title?: string
          content?: string | null
          youtube_url?: string | null
          thumbnail_url?: string | null
          views?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'posts_user_id_fkey'
            columns: ['user_id']
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          }
        ]
      }
      post_images: {
        Row: {
          id: string
          post_id: string
          url: string
          display_order: number
          created_at: string
        }
        Insert: {
          id?: string
          post_id: string
          url: string
          display_order?: number
          created_at?: string
        }
        Update: {
          id?: string
          post_id?: string
          url?: string
          display_order?: number
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'post_images_post_id_fkey'
            columns: ['post_id']
            referencedRelation: 'posts'
            referencedColumns: ['id']
          }
        ]
      }
    }
    Views: Record<string, never>
    Functions: {
      increment_views: {
        Args: { post_id: string }
        Returns: undefined
      }
    }
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}
