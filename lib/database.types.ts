export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          farcaster_id: string | null;
          wallet_address: string | null;
          username: string | null;
          display_name: string | null;
          avatar_url: string | null;
          bio: string | null;
          skills: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          farcaster_id?: string | null;
          wallet_address?: string | null;
          username?: string | null;
          display_name?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
          skills?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          farcaster_id?: string | null;
          wallet_address?: string | null;
          username?: string | null;
          display_name?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
          skills?: string[];
          updated_at?: string;
        };
      };
      gigs: {
        Row: {
          id: string;
          title: string;
          description: string;
          url: string;
          source: string;
          category: string;
          pay_rate: string;
          vetted: boolean;
          posted_date: string;
          skills: string[];
          embedding: number[] | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          url: string;
          source: string;
          category: string;
          pay_rate: string;
          vetted?: boolean;
          posted_date: string;
          skills: string[];
          embedding?: number[] | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          url?: string;
          source?: string;
          category?: string;
          pay_rate?: string;
          vetted?: boolean;
          posted_date?: string;
          skills?: string[];
          embedding?: number[] | null;
          updated_at?: string;
        };
      };
      skill_guides: {
        Row: {
          id: string;
          title: string;
          content: string;
          skill_tag: string;
          price: number;
          is_premium: boolean;
          estimated_time: string;
          difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
          embedding: number[] | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          content: string;
          skill_tag: string;
          price?: number;
          is_premium?: boolean;
          estimated_time: string;
          difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
          embedding?: number[] | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          content?: string;
          skill_tag?: string;
          price?: number;
          is_premium?: boolean;
          estimated_time?: string;
          difficulty?: 'Beginner' | 'Intermediate' | 'Advanced';
          embedding?: number[] | null;
          updated_at?: string;
        };
      };
      pitch_templates: {
        Row: {
          id: string;
          title: string;
          content: string;
          skill_tag: string;
          category: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          content: string;
          skill_tag: string;
          category: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          content?: string;
          skill_tag?: string;
          category?: string;
          updated_at?: string;
        };
      };
      saved_gigs: {
        Row: {
          id: string;
          user_id: string;
          gig_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          gig_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          gig_id?: string;
        };
      };
      purchased_content: {
        Row: {
          id: string;
          user_id: string;
          guide_id: string;
          payment_method: 'crypto' | 'fiat';
          amount_paid: number;
          transaction_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          guide_id: string;
          payment_method: 'crypto' | 'fiat';
          amount_paid: number;
          transaction_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          guide_id?: string;
          payment_method?: 'crypto' | 'fiat';
          amount_paid?: number;
          transaction_id?: string | null;
        };
      };
      completed_modules: {
        Row: {
          id: string;
          user_id: string;
          guide_id: string;
          completed_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          guide_id: string;
          completed_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          guide_id?: string;
          completed_at?: string;
        };
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          message: string;
          type: 'gig_match' | 'achievement' | 'system';
          read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          message: string;
          type: 'gig_match' | 'achievement' | 'system';
          read?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          message?: string;
          type?: 'gig_match' | 'achievement' | 'system';
          read?: boolean;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      match_gigs: {
        Args: {
          query_embedding: number[];
          match_threshold: number;
          match_count: number;
        };
        Returns: {
          id: string;
          title: string;
          description: string;
          similarity: number;
        }[];
      };
      match_guides: {
        Args: {
          query_embedding: number[];
          match_threshold: number;
          match_count: number;
        };
        Returns: {
          id: string;
          title: string;
          content: string;
          similarity: number;
        }[];
      };
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
