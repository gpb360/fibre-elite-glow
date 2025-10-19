export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      addresses: {
        Row: {
          address_line_1: string
          address_line_2: string | null
          city: string
          company: string | null
          country: string
          created_at: string | null
          first_name: string
          id: string
          is_default: boolean | null
          last_name: string
          phone: string | null
          postal_code: string
          state_province: string
          type: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          address_line_1: string
          address_line_2?: string | null
          city: string
          company?: string | null
          country?: string
          created_at?: string | null
          first_name: string
          id?: string
          is_default?: boolean | null
          last_name: string
          phone?: string | null
          postal_code: string
          state_province: string
          type: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          address_line_1?: string
          address_line_2?: string | null
          city?: string
          company?: string | null
          country?: string
          created_at?: string | null
          first_name?: string
          id?: string
          is_default?: boolean | null
          last_name?: string
          phone?: string | null
          postal_code?: string
          state_province?: string
          type?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      categories: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          name: string
          parent_id: string | null
          slug: string
          sort_order: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name: string
          parent_id?: string | null
          slug: string
          sort_order?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name?: string
          parent_id?: string | null
          slug?: string
          sort_order?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      checkout_sessions: {
        Row: {
          id: string
          session_id: string
          customer_email: string
          amount_total: number | null
          currency: string | null
          payment_intent: string | null
          metadata: Json | null
          status: string | null
          payment_status: string | null
          test_mode: boolean | null
          expires_at: string | null
          failure_reason: string | null
          user_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          session_id: string
          customer_email: string
          amount_total?: number | null
          currency?: string | null
          payment_intent?: string | null
          metadata?: Json | null
          status?: string | null
          payment_status?: string | null
          test_mode?: boolean | null
          expires_at?: string | null
          failure_reason?: string | null
          user_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          session_id?: string
          customer_email?: string
          amount_total?: number | null
          currency?: string | null
          payment_intent?: string | null
          metadata?: Json | null
          status?: string | null
          payment_status?: string | null
          test_mode?: boolean | null
          expires_at?: string | null
          failure_reason?: string | null
          user_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      customer_addresses: {
        Row: {
          address_line_1: string
          address_line_2: string | null
          city: string
          company: string | null
          country: string
          created_at: string | null
          customer_id: string | null
          first_name: string | null
          id: string
          is_default: boolean | null
          last_name: string | null
          postal_code: string
          state_province: string | null
          type: string | null
          updated_at: string | null
        }
        Insert: {
          address_line_1: string
          address_line_2?: string | null
          city: string
          company?: string | null
          country?: string
          created_at?: string | null
          customer_id?: string | null
          first_name?: string | null
          id?: string
          is_default?: boolean | null
          last_name?: string | null
          postal_code: string
          state_province?: string | null
          type?: string | null
          updated_at?: string | null
        }
        Update: {
          address_line_1?: string
          address_line_2?: string | null
          city?: string
          company?: string | null
          country?: string
          created_at?: string | null
          customer_id?: string | null
          first_name?: string | null
          id?: string
          is_default?: boolean | null
          last_name?: string | null
          postal_code?: string
          state_province?: string | null
          type?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customer_addresses_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          date_of_birth: string | null
          dietary_preferences: Json | null
          first_name: string | null
          gender: string | null
          health_goals: Json | null
          id: string
          last_name: string | null
          marketing_consent: boolean | null
          newsletter_subscription: boolean | null
          phone: string | null
          preferred_communication: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          dietary_preferences?: Json | null
          first_name?: string | null
          gender?: string | null
          health_goals?: Json | null
          id?: string
          last_name?: string | null
          marketing_consent?: boolean | null
          newsletter_subscription?: boolean | null
          phone?: string | null
          preferred_communication?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          dietary_preferences?: Json | null
          first_name?: string | null
          gender?: string | null
          health_goals?: Json | null
          id?: string
          last_name?: string | null
          marketing_consent?: boolean | null
          newsletter_subscription?: boolean | null
          phone?: string | null
          preferred_communication?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      customers: {
        Row: {
          created_at: string | null
          date_of_birth: string | null
          email: string
          first_name: string | null
          id: string
          last_name: string | null
          phone: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          date_of_birth?: string | null
          email: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          date_of_birth?: string | null
          email?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      discount_codes: {
        Row: {
          code: string
          created_at: string | null
          description: string | null
          discount_type: string
          discount_value: number
          expires_at: string | null
          id: string
          is_active: boolean | null
          minimum_order_amount: number | null
          starts_at: string | null
          updated_at: string | null
          usage_count: number | null
          usage_limit: number | null
        }
        Insert: {
          code: string
          created_at?: string | null
          description?: string | null
          discount_type: string
          discount_value: number
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          minimum_order_amount?: number | null
          starts_at?: string | null
          updated_at?: string | null
          usage_count?: number | null
          usage_limit?: number | null
        }
        Update: {
          code?: string
          created_at?: string | null
          description?: string | null
          discount_type?: string
          discount_value?: number
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          minimum_order_amount?: number | null
          starts_at?: string | null
          updated_at?: string | null
          usage_count?: number | null
          usage_limit?: number | null
        }
        Relationships: []
      }
      order_items: {
        Row: {
          created_at: string | null
          id: string
          order_id: string | null
          package_id: string | null
          product_name: string
          product_type: Database["public"]["Enums"]["product_type"]
          quantity: number
          total_price: number
          unit_price: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          order_id?: string | null
          package_id?: string | null
          product_name: string
          product_type: Database["public"]["Enums"]["product_type"]
          quantity: number
          total_price: number
          unit_price: number
        }
        Update: {
          created_at?: string | null
          id?: string
          order_id?: string | null
          package_id?: string | null
          product_name?: string
          product_type?: Database["public"]["Enums"]["product_type"]
          quantity?: number
          total_price?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "packages"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          billing_address_line_1: string | null
          billing_address_line_2: string | null
          billing_city: string | null
          billing_company: string | null
          billing_country: string | null
          billing_first_name: string | null
          billing_last_name: string | null
          billing_postal_code: string | null
          billing_state_province: string | null
          created_at: string | null
          currency: string | null
          customer_id: string | null
          delivered_at: string | null
          discount_amount: number | null
          email: string
          id: string
          notes: string | null
          order_number: string
          payment_status: Database["public"]["Enums"]["payment_status"] | null
          shipped_at: string | null
          shipping_address_line_1: string | null
          shipping_address_line_2: string | null
          shipping_amount: number | null
          shipping_city: string | null
          shipping_company: string | null
          shipping_country: string | null
          shipping_first_name: string | null
          shipping_last_name: string | null
          shipping_postal_code: string | null
          shipping_state_province: string | null
          status: Database["public"]["Enums"]["order_status"] | null
          stripe_payment_intent_id: string | null
          subtotal: number
          tax_amount: number | null
          total_amount: number
          tracking_number: string | null
          updated_at: string | null
          session_id: string | null
          items: Json | null
          shipping_address: Json | null
          customer_name: string | null
          customer_email: string | null
          amount_total: number | null
          payment_intent: string | null
          test_mode: boolean | null
          metadata: Json | null
        }
        Insert: {
          billing_address_line_1?: string | null
          billing_address_line_2?: string | null
          billing_city?: string | null
          billing_company?: string | null
          billing_country?: string | null
          billing_first_name?: string | null
          billing_last_name?: string | null
          billing_postal_code?: string | null
          billing_state_province?: string | null
          created_at?: string | null
          currency?: string | null
          customer_id?: string | null
          delivered_at?: string | null
          discount_amount?: number | null
          email: string
          id?: string
          notes?: string | null
          order_number: string
          payment_status?: Database["public"]["Enums"]["payment_status"] | null
          shipped_at?: string | null
          shipping_address_line_1?: string | null
          shipping_address_line_2?: string | null
          shipping_amount?: number | null
          shipping_city?: string | null
          shipping_company?: string | null
          shipping_country?: string | null
          shipping_first_name?: string | null
          shipping_last_name?: string | null
          shipping_postal_code?: string | null
          shipping_state_province?: string | null
          status?: Database["public"]["Enums"]["order_status"] | null
          stripe_payment_intent_id?: string | null
          subtotal: number
          tax_amount?: number | null
          total_amount: number
          tracking_number?: string | null
          updated_at?: string | null
          session_id?: string | null
          items?: Json | null
          shipping_address?: Json | null
          customer_name?: string | null
          customer_email?: string | null
          amount_total?: number | null
          payment_intent?: string | null
          test_mode?: boolean | null
          metadata?: Json | null
        }
        Update: {
          billing_address_line_1?: string | null
          billing_address_line_2?: string | null
          billing_city?: string | null
          billing_company?: string | null
          billing_country?: string | null
          billing_first_name?: string | null
          billing_last_name?: string | null
          billing_postal_code?: string | null
          billing_state_province?: string | null
          created_at?: string | null
          currency?: string | null
          customer_id?: string | null
          delivered_at?: string | null
          discount_amount?: number | null
          email?: string
          id?: string
          notes?: string | null
          order_number?: string
          payment_status?: Database["public"]["Enums"]["payment_status"] | null
          shipped_at?: string | null
          shipping_address_line_1?: string | null
          shipping_address_line_2?: string | null
          shipping_amount?: number | null
          shipping_city?: string | null
          shipping_company?: string | null
          shipping_country?: string | null
          shipping_first_name?: string | null
          shipping_last_name?: string | null
          shipping_postal_code?: string | null
          shipping_state_province?: string | null
          status?: Database["public"]["Enums"]["order_status"] | null
          stripe_payment_intent_id?: string | null
          subtotal?: number
          tax_amount?: number | null
          total_amount?: number
          tracking_number?: string | null
          updated_at?: string | null
          session_id?: string | null
          items?: Json | null
          shipping_address?: Json | null
          customer_name?: string | null
          customer_email?: string | null
          amount_total?: number | null
          payment_intent?: string | null
          test_mode?: boolean | null
          metadata?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      packages: {
        Row: {
          created_at: string
          dimensions_cm: string | null
          id: string
          is_active: boolean | null
          is_popular: boolean | null
          original_price: number | null
          price: number
          product_id: string | null
          product_name: string
          product_type: string
          quantity: number
          savings: number | null
          sku: string | null
          stock_quantity: number | null
          updated_at: string
          weight_grams: number | null
        }
        Insert: {
          created_at?: string
          dimensions_cm?: string | null
          id?: string
          is_active?: boolean | null
          is_popular?: boolean | null
          original_price?: number | null
          price: number
          product_id?: string | null
          product_name: string
          product_type: string
          quantity: number
          savings?: number | null
          sku?: string | null
          stock_quantity?: number | null
          updated_at?: string
          weight_grams?: number | null
        }
        Update: {
          created_at?: string
          dimensions_cm?: string | null
          id?: string
          is_active?: boolean | null
          is_popular?: boolean | null
          original_price?: number | null
          price?: number
          product_id?: string | null
          product_name?: string
          product_type?: string
          quantity?: number
          savings?: number | null
          sku?: string | null
          stock_quantity?: number | null
          updated_at?: string
          weight_grams?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "packages_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_images: {
        Row: {
          alt_text: string | null
          created_at: string | null
          id: string
          image_url: string
          is_primary: boolean | null
          product_id: string | null
          sort_order: number | null
        }
        Insert: {
          alt_text?: string | null
          created_at?: string | null
          id?: string
          image_url: string
          is_primary?: boolean | null
          product_id?: string | null
          sort_order?: number | null
        }
        Update: {
          alt_text?: string | null
          created_at?: string | null
          id?: string
          image_url?: string
          is_primary?: boolean | null
          product_id?: string | null
          sort_order?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "product_images_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          base_price: number
          category_id: string | null
          created_at: string | null
          description: string | null
          featured: boolean | null
          id: string
          is_active: boolean | null
          meta_description: string | null
          meta_title: string | null
          name: string
          product_type: Database["public"]["Enums"]["product_type"]
          short_description: string | null
          slug: string
          updated_at: string | null
        }
        Insert: {
          base_price: number
          category_id?: string | null
          created_at?: string | null
          description?: string | null
          featured?: boolean | null
          id?: string
          is_active?: boolean | null
          meta_description?: string | null
          meta_title?: string | null
          name: string
          product_type: Database["public"]["Enums"]["product_type"]
          short_description?: string | null
          slug: string
          updated_at?: string | null
        }
        Update: {
          base_price?: number
          category_id?: string | null
          created_at?: string | null
          description?: string | null
          featured?: boolean | null
          id?: string
          is_active?: boolean | null
          meta_description?: string | null
          meta_title?: string | null
          name?: string
          product_type?: Database["public"]["Enums"]["product_type"]
          short_description?: string | null
          slug?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      secrets: {
        Row: {
          id: string
          key: string
          value: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          key: string
          value: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          key?: string
          value?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      order_status:
        | "pending"
        | "processing"
        | "shipped"
        | "delivered"
        | "cancelled"
      payment_status: "pending" | "paid" | "failed" | "refunded"
      product_type: "total_essential" | "total_essential_plus"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      order_status: [
        "pending",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
      ],
      payment_status: ["pending", "paid", "failed", "refunded"],
      product_type: ["total_essential", "total_essential_plus"],
    },
  },
} as const
