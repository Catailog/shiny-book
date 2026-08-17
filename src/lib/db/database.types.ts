export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      graphql: {
        Args: {
          extensions?: Json;
          operationName?: string;
          query?: string;
          variables?: Json;
        };
        Returns: Json;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  public: {
    Tables: {
      addresses: {
        Row: {
          address_line1: string;
          address_line2: string | null;
          consumer_id: string;
          created_at: string;
          id: string;
          is_default: boolean;
          label: string;
          phone: string;
          postal_code: string;
          recipient_name: string;
          updated_at: string;
        };
        Insert: {
          address_line1: string;
          address_line2?: string | null;
          consumer_id: string;
          created_at?: string;
          id?: string;
          is_default?: boolean;
          label: string;
          phone: string;
          postal_code: string;
          recipient_name: string;
          updated_at?: string;
        };
        Update: {
          address_line1?: string;
          address_line2?: string | null;
          consumer_id?: string;
          created_at?: string;
          id?: string;
          is_default?: boolean;
          label?: string;
          phone?: string;
          postal_code?: string;
          recipient_name?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      announcements: {
        Row: {
          category: string;
          content: string;
          created_at: string;
          id: string;
          title: string;
          updated_at: string;
        };
        Insert: {
          category?: string;
          content: string;
          created_at?: string;
          id?: string;
          title: string;
          updated_at?: string;
        };
        Update: {
          category?: string;
          content?: string;
          created_at?: string;
          id?: string;
          title?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      api_keys: {
        Row: {
          client_name: string;
          created_at: string;
          id: string;
          key_hash: string;
          revoked_at: string | null;
          role: string;
        };
        Insert: {
          client_name: string;
          created_at?: string;
          id?: string;
          key_hash: string;
          revoked_at?: string | null;
          role?: string;
        };
        Update: {
          client_name?: string;
          created_at?: string;
          id?: string;
          key_hash?: string;
          revoked_at?: string | null;
          role?: string;
        };
        Relationships: [];
      };
      coupons: {
        Row: {
          code: string;
          created_at: string;
          discount_type: string;
          discount_value: number;
          expires_at: string | null;
          id: string;
          is_active: boolean;
          max_uses: number | null;
          used_count: number;
        };
        Insert: {
          code: string;
          created_at?: string;
          discount_type: string;
          discount_value: number;
          expires_at?: string | null;
          id?: string;
          is_active?: boolean;
          max_uses?: number | null;
          used_count?: number;
        };
        Update: {
          code?: string;
          created_at?: string;
          discount_type?: string;
          discount_value?: number;
          expires_at?: string | null;
          id?: string;
          is_active?: boolean;
          max_uses?: number | null;
          used_count?: number;
        };
        Relationships: [];
      };
      faqs: {
        Row: {
          answer: string;
          created_at: string;
          id: string;
          question: string;
          updated_at: string;
        };
        Insert: {
          answer: string;
          created_at?: string;
          id?: string;
          question: string;
          updated_at?: string;
        };
        Update: {
          answer?: string;
          created_at?: string;
          id?: string;
          question?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      inquiries: {
        Row: {
          answer: string | null;
          answered_at: string | null;
          consumer_id: string;
          content: string;
          created_at: string;
          id: string;
          title: string;
          updated_at: string;
        };
        Insert: {
          answer?: string | null;
          answered_at?: string | null;
          consumer_id: string;
          content: string;
          created_at?: string;
          id?: string;
          title: string;
          updated_at?: string;
        };
        Update: {
          answer?: string | null;
          answered_at?: string | null;
          consumer_id?: string;
          content?: string;
          created_at?: string;
          id?: string;
          title?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      orders: {
        Row: {
          amount: number;
          client_id: string | null;
          consumer_id: string | null;
          coupon_id: string | null;
          cover_file_url: string;
          created_at: string;
          id: string;
          manuscript_file_url: string;
          quantity: number;
          status: string;
          title: string;
          updated_at: string;
        };
        Insert: {
          amount: number;
          client_id?: string | null;
          consumer_id?: string | null;
          coupon_id?: string | null;
          cover_file_url: string;
          created_at?: string;
          id?: string;
          manuscript_file_url: string;
          quantity: number;
          status?: string;
          title: string;
          updated_at?: string;
        };
        Update: {
          amount?: number;
          client_id?: string | null;
          consumer_id?: string | null;
          coupon_id?: string | null;
          cover_file_url?: string;
          created_at?: string;
          id?: string;
          manuscript_file_url?: string;
          quantity?: number;
          status?: string;
          title?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'orders_client_id_fkey';
            columns: ['client_id'];
            isOneToOne: false;
            referencedRelation: 'api_keys';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'orders_coupon_id_fkey';
            columns: ['coupon_id'];
            isOneToOne: false;
            referencedRelation: 'coupons';
            referencedColumns: ['id'];
          },
        ];
      };
      print_jobs: {
        Row: {
          cover_file_url: string;
          created_at: string;
          id: string;
          manuscript_file_url: string;
          order_id: string;
          quantity: number;
          status: string;
          updated_at: string;
        };
        Insert: {
          cover_file_url: string;
          created_at?: string;
          id?: string;
          manuscript_file_url: string;
          order_id: string;
          quantity: number;
          status?: string;
          updated_at?: string;
        };
        Update: {
          cover_file_url?: string;
          created_at?: string;
          id?: string;
          manuscript_file_url?: string;
          order_id?: string;
          quantity?: number;
          status?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'print_jobs_order_id_fkey';
            columns: ['order_id'];
            isOneToOne: false;
            referencedRelation: 'orders';
            referencedColumns: ['id'];
          },
        ];
      };
      products: {
        Row: {
          category: string;
          created_at: string;
          description: string;
          id: string;
          image_url: string;
          is_active: boolean;
          name: string;
          price: number;
          size: string;
          slug: string;
          updated_at: string;
        };
        Insert: {
          category: string;
          created_at?: string;
          description: string;
          id?: string;
          image_url: string;
          is_active?: boolean;
          name: string;
          price: number;
          size: string;
          slug: string;
          updated_at?: string;
        };
        Update: {
          category?: string;
          created_at?: string;
          description?: string;
          id?: string;
          image_url?: string;
          is_active?: boolean;
          name?: string;
          price?: number;
          size?: string;
          slug?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      reviews: {
        Row: {
          consumer_id: string;
          content: string;
          created_at: string;
          id: string;
          order_id: string;
          rating: number;
          updated_at: string;
        };
        Insert: {
          consumer_id: string;
          content: string;
          created_at?: string;
          id?: string;
          order_id: string;
          rating: number;
          updated_at?: string;
        };
        Update: {
          consumer_id?: string;
          content?: string;
          created_at?: string;
          id?: string;
          order_id?: string;
          rating?: number;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'reviews_order_id_fkey';
            columns: ['order_id'];
            isOneToOne: true;
            referencedRelation: 'orders';
            referencedColumns: ['id'];
          },
        ];
      };
      shipment_jobs: {
        Row: {
          created_at: string;
          id: string;
          order_id: string;
          status: string;
          tracking_number: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          order_id: string;
          status?: string;
          tracking_number: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          order_id?: string;
          status?: string;
          tracking_number?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'shipment_jobs_order_id_fkey';
            columns: ['order_id'];
            isOneToOne: false;
            referencedRelation: 'orders';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, 'public'>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] & DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema['Tables'] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema['Tables'] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    keyof DefaultSchema['Enums'] | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    keyof DefaultSchema['CompositeTypes'] | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const;
