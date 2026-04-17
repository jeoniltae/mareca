// 이 파일은 `npm run db:types` 명령으로 자동 생성됩니다.
// Supabase 프로젝트와 연결 후 재생성하세요.

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
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
          views: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          board?: string
          category?: string
          title: string
          content?: string | null
          youtube_url?: string | null
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
          views?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'posts_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
    }
    Views: {
      [_ in never]?: never
    }
    Functions: {
      increment_views: {
        Args: { post_id: string }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]?: never
    }
  }
}
