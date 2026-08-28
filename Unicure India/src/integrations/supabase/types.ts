export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5";
  };
  public: {
    Tables: {
      admin_auth_audit: {
        Row: {
          created_at: string;
          email: string | null;
          event: Database["public"]["Enums"]["admin_auth_event"];
          id: string;
          reason: string | null;
          success: boolean;
          user_agent: string | null;
          user_id: string | null;
        };
        Insert: {
          created_at?: string;
          email?: string | null;
          event: Database["public"]["Enums"]["admin_auth_event"];
          id?: string;
          reason?: string | null;
          success: boolean;
          user_agent?: string | null;
          user_id?: string | null;
        };
        Update: {
          created_at?: string;
          email?: string | null;
          event?: Database["public"]["Enums"]["admin_auth_event"];
          id?: string;
          reason?: string | null;
          success?: boolean;
          user_agent?: string | null;
          user_id?: string | null;
        };
        Relationships: [];
      };
      admin_requests: {
        Row: {
          created_at: string;
          decided_at: string | null;
          decided_by: string | null;
          email: string;
          id: string;
          note: string | null;
          status: Database["public"]["Enums"]["admin_request_status"];
          updated_at: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          decided_at?: string | null;
          decided_by?: string | null;
          email: string;
          id?: string;
          note?: string | null;
          status?: Database["public"]["Enums"]["admin_request_status"];
          updated_at?: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          decided_at?: string | null;
          decided_by?: string | null;
          email?: string;
          id?: string;
          note?: string | null;
          status?: Database["public"]["Enums"]["admin_request_status"];
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      downloads: {
        Row: {
          category: string | null;
          created_at: string;
          description: string | null;
          file_url: string;
          id: string;
          is_active: boolean;
          sort_order: number;
          title: string;
          updated_at: string;
        };
        Insert: {
          category?: string | null;
          created_at?: string;
          description?: string | null;
          file_url: string;
          id?: string;
          is_active?: boolean;
          sort_order?: number;
          title: string;
          updated_at?: string;
        };
        Update: {
          category?: string | null;
          created_at?: string;
          description?: string | null;
          file_url?: string;
          id?: string;
          is_active?: boolean;
          sort_order?: number;
          title?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      job_openings: {
        Row: {
          apply_email: string | null;
          created_at: string;
          department: string | null;
          description: string | null;
          employment_type: string | null;
          id: string;
          is_open: boolean;
          location: string | null;
          title: string;
          updated_at: string;
        };
        Insert: {
          apply_email?: string | null;
          created_at?: string;
          department?: string | null;
          description?: string | null;
          employment_type?: string | null;
          id?: string;
          is_open?: boolean;
          location?: string | null;
          title: string;
          updated_at?: string;
        };
        Update: {
          apply_email?: string | null;
          created_at?: string;
          department?: string | null;
          description?: string | null;
          employment_type?: string | null;
          id?: string;
          is_open?: boolean;
          location?: string | null;
          title?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      media_tags: {
        Row: {
          created_at: string;
          id: string;
          storage_path: string;
          tags: string[];
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          storage_path: string;
          tags?: string[];
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          storage_path?: string;
          tags?: string[];
          updated_at?: string;
        };
        Relationships: [];
      };
      news: {
        Row: {
          body: string | null;
          cover_url: string | null;
          created_at: string;
          excerpt: string | null;
          id: string;
          published: boolean;
          published_at: string | null;
          slug: string;
          title: string;
          updated_at: string;
        };
        Insert: {
          body?: string | null;
          cover_url?: string | null;
          created_at?: string;
          excerpt?: string | null;
          id?: string;
          published?: boolean;
          published_at?: string | null;
          slug: string;
          title: string;
          updated_at?: string;
        };
        Update: {
          body?: string | null;
          cover_url?: string | null;
          created_at?: string;
          excerpt?: string | null;
          id?: string;
          published?: boolean;
          published_at?: string | null;
          slug?: string;
          title?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      products: {
        Row: {
          category: string;
          composition: string | null;
          created_at: string;
          id: string;
          image_url: string | null;
          is_active: boolean;
          name: string;
          packaging: string | null;
          sort_order: number;
          therapeutic_area: string | null;
          updated_at: string;
        };
        Insert: {
          category?: string;
          composition?: string | null;
          created_at?: string;
          id?: string;
          image_url?: string | null;
          is_active?: boolean;
          name: string;
          packaging?: string | null;
          sort_order?: number;
          therapeutic_area?: string | null;
          updated_at?: string;
        };
        Update: {
          category?: string;
          composition?: string | null;
          created_at?: string;
          id?: string;
          image_url?: string | null;
          is_active?: boolean;
          name?: string;
          packaging?: string | null;
          sort_order?: number;
          therapeutic_area?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          created_at: string;
          email: string | null;
          full_name: string | null;
          id: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          email?: string | null;
          full_name?: string | null;
          id: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          email?: string | null;
          full_name?: string | null;
          id?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      site_content: {
        Row: {
          created_at: string;
          draft: Json;
          key: string;
          published: Json;
          published_at: string | null;
          published_by: string | null;
          updated_at: string;
          updated_by: string | null;
        };
        Insert: {
          created_at?: string;
          draft?: Json;
          key: string;
          published?: Json;
          published_at?: string | null;
          published_by?: string | null;
          updated_at?: string;
          updated_by?: string | null;
        };
        Update: {
          created_at?: string;
          draft?: Json;
          key?: string;
          published?: Json;
          published_at?: string | null;
          published_by?: string | null;
          updated_at?: string;
          updated_by?: string | null;
        };
        Relationships: [];
      };
      site_content_versions: {
        Row: {
          id: string;
          key: string;
          note: string | null;
          published_at: string;
          published_by: string | null;
          snapshot: Json;
        };
        Insert: {
          id?: string;
          key: string;
          note?: string | null;
          published_at?: string;
          published_by?: string | null;
          snapshot: Json;
        };
        Update: {
          id?: string;
          key?: string;
          note?: string | null;
          published_at?: string;
          published_by?: string | null;
          snapshot?: Json;
        };
        Relationships: [];
      };
      site_settings: {
        Row: {
          key: string;
          updated_at: string;
          value: Json;
        };
        Insert: {
          key: string;
          updated_at?: string;
          value?: Json;
        };
        Update: {
          key?: string;
          updated_at?: string;
          value?: Json;
        };
        Relationships: [];
      };
      user_roles: {
        Row: {
          created_at: string;
          id: string;
          role: Database["public"]["Enums"]["app_role"];
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          role: Database["public"]["Enums"]["app_role"];
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          role?: Database["public"]["Enums"]["app_role"];
          user_id?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      site_content_published: {
        Row: {
          key: string | null;
          published: Json | null;
          published_at: string | null;
        };
        Insert: {
          key?: string | null;
          published?: Json | null;
          published_at?: string | null;
        };
        Update: {
          key?: string | null;
          published?: Json | null;
          published_at?: string | null;
        };
        Relationships: [];
      };
    };
    Functions: {
      email_is_admin: { Args: { _email: string }; Returns: boolean };
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"];
          _user_id: string;
        };
        Returns: boolean;
      };
    };
    Enums: {
      admin_auth_event:
        | "login_success"
        | "login_failed"
        | "non_admin_blocked"
        | "password_reset_requested"
        | "password_reset_role_check_failed";
      admin_request_status: "pending" | "approved" | "rejected";
      app_role: "admin" | "user" | "editor";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    keyof DefaultSchema["Enums"] | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    keyof DefaultSchema["CompositeTypes"] | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {
      admin_auth_event: [
        "login_success",
        "login_failed",
        "non_admin_blocked",
        "password_reset_requested",
        "password_reset_role_check_failed",
      ],
      admin_request_status: ["pending", "approved", "rejected"],
      app_role: ["admin", "user", "editor"],
    },
  },
} as const;
