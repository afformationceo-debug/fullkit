export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

// Enums
export type LeadStatus = "new" | "contacted" | "meeting_scheduled" | "proposal_sent" | "negotiating" | "won" | "lost";
export type LeadSource = "website" | "referral" | "kmong" | "naver" | "google" | "youtube" | "email" | "cafe" | "meta_ad" | "other";
export type ProjectStatus = "planning" | "designing" | "developing" | "testing" | "launched" | "maintaining" | "completed" | "cancelled";
export type TaskStatus = "todo" | "in_progress" | "review" | "done";
export type TaskPriority = "low" | "medium" | "high" | "urgent";
export type InvoiceStatus = "draft" | "sent" | "paid" | "overdue" | "cancelled";
export type ServiceType = "homepage" | "app" | "solution" | "automation";
export type FeedbackStatus = "pending" | "in_progress" | "resolved" | "closed";
export type TicketPriority = "low" | "medium" | "high" | "critical";
export type TicketStatus = "open" | "in_progress" | "waiting" | "resolved" | "closed";
export type BlogStatus = "draft" | "scheduled" | "published" | "archived";
export type UserRole = "admin" | "manager" | "viewer";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          role: UserRole;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          role?: UserRole;
          avatar_url?: string | null;
        };
        Update: {
          full_name?: string | null;
          role?: UserRole;
          avatar_url?: string | null;
        };
      };
      leads: {
        Row: {
          id: string;
          lead_number: string;
          name: string;
          email: string | null;
          phone: string;
          company: string | null;
          service_type: ServiceType;
          budget_range: string | null;
          description: string;
          status: LeadStatus;
          source: LeadSource;
          assigned_to: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          name: string;
          email?: string | null;
          phone: string;
          company?: string | null;
          service_type: ServiceType;
          budget_range?: string | null;
          description: string;
          source?: LeadSource;
        };
        Update: {
          name?: string;
          email?: string | null;
          phone?: string;
          company?: string | null;
          service_type?: ServiceType;
          budget_range?: string | null;
          description?: string;
          status?: LeadStatus;
          source?: LeadSource;
          assigned_to?: string | null;
        };
      };
      lead_notes: {
        Row: {
          id: string;
          lead_id: string;
          author_id: string;
          content: string;
          created_at: string;
        };
        Insert: {
          lead_id: string;
          author_id: string;
          content: string;
        };
        Update: {
          content?: string;
        };
      };
      clients: {
        Row: {
          id: string;
          client_number: string;
          company_name: string;
          business_number: string | null;
          address: string | null;
          notes: string | null;
          lead_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          company_name: string;
          business_number?: string | null;
          address?: string | null;
          notes?: string | null;
          lead_id?: string | null;
        };
        Update: {
          company_name?: string;
          business_number?: string | null;
          address?: string | null;
          notes?: string | null;
        };
      };
      client_contacts: {
        Row: {
          id: string;
          client_id: string;
          name: string;
          email: string | null;
          phone: string | null;
          position: string | null;
          is_primary: boolean;
          created_at: string;
        };
        Insert: {
          client_id: string;
          name: string;
          email?: string | null;
          phone?: string | null;
          position?: string | null;
          is_primary?: boolean;
        };
        Update: {
          name?: string;
          email?: string | null;
          phone?: string | null;
          position?: string | null;
          is_primary?: boolean;
        };
      };
      meetings: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          meeting_date: string;
          duration_minutes: number;
          location: string | null;
          meeting_type: string;
          lead_id: string | null;
          client_id: string | null;
          organizer_id: string;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          title: string;
          description?: string | null;
          meeting_date: string;
          duration_minutes?: number;
          location?: string | null;
          meeting_type?: string;
          lead_id?: string | null;
          client_id?: string | null;
          organizer_id: string;
          notes?: string | null;
        };
        Update: {
          title?: string;
          description?: string | null;
          meeting_date?: string;
          duration_minutes?: number;
          location?: string | null;
          meeting_type?: string;
          notes?: string | null;
        };
      };
      projects: {
        Row: {
          id: string;
          project_number: string;
          name: string;
          description: string | null;
          client_id: string;
          service_type: ServiceType;
          status: ProjectStatus;
          start_date: string | null;
          end_date: string | null;
          budget: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          name: string;
          description?: string | null;
          client_id: string;
          service_type: ServiceType;
          status?: ProjectStatus;
          start_date?: string | null;
          end_date?: string | null;
          budget?: number | null;
        };
        Update: {
          name?: string;
          description?: string | null;
          service_type?: ServiceType;
          status?: ProjectStatus;
          start_date?: string | null;
          end_date?: string | null;
          budget?: number | null;
        };
      };
      tasks: {
        Row: {
          id: string;
          project_id: string;
          title: string;
          description: string | null;
          status: TaskStatus;
          priority: TaskPriority;
          assigned_to: string | null;
          due_date: string | null;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          project_id: string;
          title: string;
          description?: string | null;
          status?: TaskStatus;
          priority?: TaskPriority;
          assigned_to?: string | null;
          due_date?: string | null;
          sort_order?: number;
        };
        Update: {
          title?: string;
          description?: string | null;
          status?: TaskStatus;
          priority?: TaskPriority;
          assigned_to?: string | null;
          due_date?: string | null;
          sort_order?: number;
        };
      };
      invoices: {
        Row: {
          id: string;
          invoice_number: string;
          project_id: string;
          client_id: string;
          status: InvoiceStatus;
          issue_date: string;
          due_date: string;
          subtotal: number;
          tax: number;
          total: number;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          project_id: string;
          client_id: string;
          status?: InvoiceStatus;
          issue_date: string;
          due_date: string;
          subtotal: number;
          tax: number;
          total: number;
          notes?: string | null;
        };
        Update: {
          status?: InvoiceStatus;
          issue_date?: string;
          due_date?: string;
          subtotal?: number;
          tax?: number;
          total?: number;
          notes?: string | null;
        };
      };
      invoice_items: {
        Row: {
          id: string;
          invoice_id: string;
          description: string;
          quantity: number;
          unit_price: number;
          amount: number;
          sort_order: number;
        };
        Insert: {
          invoice_id: string;
          description: string;
          quantity: number;
          unit_price: number;
          amount: number;
          sort_order?: number;
        };
        Update: {
          description?: string;
          quantity?: number;
          unit_price?: number;
          amount?: number;
          sort_order?: number;
        };
      };
      feedback: {
        Row: {
          id: string;
          project_id: string;
          client_id: string;
          title: string;
          content: string;
          status: FeedbackStatus;
          priority: TaskPriority;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          project_id: string;
          client_id: string;
          title: string;
          content: string;
          status?: FeedbackStatus;
          priority?: TaskPriority;
        };
        Update: {
          title?: string;
          content?: string;
          status?: FeedbackStatus;
          priority?: TaskPriority;
        };
      };
      maintenance_contracts: {
        Row: {
          id: string;
          contract_number: string;
          project_id: string;
          client_id: string;
          start_date: string;
          end_date: string;
          monthly_fee: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          project_id: string;
          client_id: string;
          start_date: string;
          end_date: string;
          monthly_fee: number;
          is_active?: boolean;
        };
        Update: {
          start_date?: string;
          end_date?: string;
          monthly_fee?: number;
          is_active?: boolean;
        };
      };
      tickets: {
        Row: {
          id: string;
          ticket_number: string;
          contract_id: string;
          title: string;
          description: string;
          status: TicketStatus;
          priority: TicketPriority;
          assigned_to: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          contract_id: string;
          title: string;
          description: string;
          status?: TicketStatus;
          priority?: TicketPriority;
          assigned_to?: string | null;
        };
        Update: {
          title?: string;
          description?: string;
          status?: TicketStatus;
          priority?: TicketPriority;
          assigned_to?: string | null;
        };
      };
      blog_posts: {
        Row: {
          id: string;
          title: string;
          slug: string;
          content: string;
          excerpt: string;
          cover_image_url: string | null;
          category: string;
          tags: string[];
          status: BlogStatus;
          meta_title: string | null;
          meta_description: string | null;
          faq_schema: Json | null;
          author_id: string | null;
          published_at: string | null;
          scheduled_for: string | null;
          reading_time_minutes: number;
          view_count: number;
          primary_keyword: string | null;
          quality_score: number;
          keyword_density: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          title: string;
          slug: string;
          content: string;
          excerpt: string;
          cover_image_url?: string | null;
          category: string;
          tags?: string[];
          status?: BlogStatus;
          meta_title?: string | null;
          meta_description?: string | null;
          faq_schema?: Json | null;
          author_id?: string | null;
          published_at?: string | null;
          scheduled_for?: string | null;
          reading_time_minutes?: number;
          primary_keyword?: string | null;
          quality_score?: number;
          keyword_density?: number | null;
        };
        Update: {
          title?: string;
          slug?: string;
          content?: string;
          excerpt?: string;
          cover_image_url?: string | null;
          category?: string;
          tags?: string[];
          status?: BlogStatus;
          meta_title?: string | null;
          meta_description?: string | null;
          faq_schema?: Json | null;
          published_at?: string | null;
          scheduled_for?: string | null;
          reading_time_minutes?: number;
          primary_keyword?: string | null;
          quality_score?: number;
          keyword_density?: number | null;
        };
      };
      blog_keywords: {
        Row: {
          id: string;
          keyword: string;
          service_type: ServiceType | null;
          industry: string | null;
          search_volume: number | null;
          difficulty: number | null;
          used: boolean;
          secondary_keywords: string[];
          category: string;
          target_audience: string | null;
          priority: number;
          service_category: string;
          blog_post_id: string | null;
          created_at: string;
        };
        Insert: {
          keyword: string;
          service_type?: ServiceType | null;
          industry?: string | null;
          search_volume?: number | null;
          difficulty?: number | null;
          used?: boolean;
          secondary_keywords?: string[];
          category?: string;
          target_audience?: string | null;
          priority?: number;
          service_category?: string;
          blog_post_id?: string | null;
        };
        Update: {
          keyword?: string;
          search_volume?: number | null;
          difficulty?: number | null;
          used?: boolean;
          secondary_keywords?: string[];
          category?: string;
          target_audience?: string | null;
          priority?: number;
          service_category?: string;
          blog_post_id?: string | null;
        };
      };
      deliverables: {
        Row: {
          id: string;
          project_id: string;
          title: string;
          description: string | null;
          file_url: string | null;
          file_type: string | null;
          version: string;
          created_at: string;
        };
        Insert: {
          project_id: string;
          title: string;
          description?: string | null;
          file_url?: string | null;
          file_type?: string | null;
          version?: string;
        };
        Update: {
          title?: string;
          description?: string | null;
          file_url?: string | null;
          version?: string;
        };
      };
      audit_logs: {
        Row: {
          id: string;
          user_id: string | null;
          action: string;
          table_name: string;
          record_id: string;
          old_data: Json | null;
          new_data: Json | null;
          created_at: string;
        };
        Insert: {
          user_id?: string | null;
          action: string;
          table_name: string;
          record_id: string;
          old_data?: Json | null;
          new_data?: Json | null;
        };
        Update: never;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      lead_status: LeadStatus;
      lead_source: LeadSource;
      project_status: ProjectStatus;
      task_status: TaskStatus;
      task_priority: TaskPriority;
      invoice_status: InvoiceStatus;
      service_type: ServiceType;
      feedback_status: FeedbackStatus;
      ticket_priority: TicketPriority;
      ticket_status: TicketStatus;
      blog_status: BlogStatus;
      user_role: UserRole;
    };
  };
}
