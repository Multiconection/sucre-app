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
          user_id: string
          name: string | null
          email: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name?: string | null
          email?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string | null
          email?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      listings: {
        Row: {
          id: string
          profile_id: string
          title: string
          description: string | null
          price: number
          credits_required: number
          status: 'active' | 'inactive' | 'sold'
          category: string | null
          image_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          profile_id: string
          title: string
          description?: string | null
          price?: number
          credits_required: number
          status?: 'active' | 'inactive' | 'sold'
          category?: string | null
          image_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          profile_id?: string
          title?: string
          description?: string | null
          price?: number
          credits_required?: number
          status?: 'active' | 'inactive' | 'sold'
          category?: string | null
          image_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      transactions: {
        Row: {
          id: string
          profile_id: string
          listing_id: string | null
          type: 'credit' | 'debit'
          amount: number
          balance_before: number
          balance_after: number
          description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          profile_id: string
          listing_id?: string | null
          type: 'credit' | 'debit'
          amount: number
          balance_before: number
          balance_after: number
          description?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          profile_id?: string
          listing_id?: string | null
          type?: 'credit' | 'debit'
          amount?: number
          balance_before?: number
          balance_after?: number
          description?: string | null
          created_at?: string
        }
      }
      wallet: {
        Row: {
          id: string
          profile_id: string
          credits: number
          updated_at: string
        }
        Insert: {
          id?: string
          profile_id: string
          credits?: number
          updated_at?: string
        }
        Update: {
          id?: string
          profile_id?: string
          credits?: number
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
