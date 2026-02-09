-- Full Kit - Initial Database Schema
-- ====================================

-- 1. ENUMS
CREATE TYPE lead_status AS ENUM ('new', 'contacted', 'meeting_scheduled', 'proposal_sent', 'negotiating', 'won', 'lost');
CREATE TYPE lead_source AS ENUM ('website', 'referral', 'kmong', 'naver', 'google', 'youtube', 'email', 'cafe', 'meta_ad', 'other');
CREATE TYPE project_status AS ENUM ('planning', 'designing', 'developing', 'testing', 'launched', 'maintaining', 'completed', 'cancelled');
CREATE TYPE task_status AS ENUM ('todo', 'in_progress', 'review', 'done');
CREATE TYPE task_priority AS ENUM ('low', 'medium', 'high', 'urgent');
CREATE TYPE invoice_status AS ENUM ('draft', 'sent', 'paid', 'overdue', 'cancelled');
CREATE TYPE service_type AS ENUM ('homepage', 'app', 'solution', 'automation');
CREATE TYPE feedback_status AS ENUM ('pending', 'in_progress', 'resolved', 'closed');
CREATE TYPE ticket_priority AS ENUM ('low', 'medium', 'high', 'critical');
CREATE TYPE ticket_status AS ENUM ('open', 'in_progress', 'waiting', 'resolved', 'closed');
CREATE TYPE blog_status AS ENUM ('draft', 'scheduled', 'published', 'archived');
CREATE TYPE user_role AS ENUM ('admin', 'manager', 'viewer');

-- 2. updated_at trigger function
CREATE OR REPLACE FUNCTION trigger_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 3. Auto number generation functions
CREATE OR REPLACE FUNCTION generate_lead_number() RETURNS TRIGGER AS $$
DECLARE seq_num INT;
BEGIN
  SELECT COALESCE(MAX(CAST(SUBSTRING(lead_number FROM 9) AS INT)), 0) + 1
  INTO seq_num FROM leads WHERE lead_number LIKE 'LD-' || TO_CHAR(NOW(), 'YYYY') || '-%';
  NEW.lead_number := 'LD-' || TO_CHAR(NOW(), 'YYYY') || '-' || LPAD(seq_num::TEXT, 4, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION generate_client_number() RETURNS TRIGGER AS $$
DECLARE seq_num INT;
BEGIN
  SELECT COALESCE(MAX(CAST(SUBSTRING(client_number FROM 9) AS INT)), 0) + 1
  INTO seq_num FROM clients WHERE client_number LIKE 'CL-' || TO_CHAR(NOW(), 'YYYY') || '-%';
  NEW.client_number := 'CL-' || TO_CHAR(NOW(), 'YYYY') || '-' || LPAD(seq_num::TEXT, 4, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION generate_project_number() RETURNS TRIGGER AS $$
DECLARE seq_num INT;
BEGIN
  SELECT COALESCE(MAX(CAST(SUBSTRING(project_number FROM 9) AS INT)), 0) + 1
  INTO seq_num FROM projects WHERE project_number LIKE 'PJ-' || TO_CHAR(NOW(), 'YYYY') || '-%';
  NEW.project_number := 'PJ-' || TO_CHAR(NOW(), 'YYYY') || '-' || LPAD(seq_num::TEXT, 4, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION generate_invoice_number() RETURNS TRIGGER AS $$
DECLARE seq_num INT;
BEGIN
  SELECT COALESCE(MAX(CAST(SUBSTRING(invoice_number FROM 9) AS INT)), 0) + 1
  INTO seq_num FROM invoices WHERE invoice_number LIKE 'IV-' || TO_CHAR(NOW(), 'YYYY') || '-%';
  NEW.invoice_number := 'IV-' || TO_CHAR(NOW(), 'YYYY') || '-' || LPAD(seq_num::TEXT, 4, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION generate_contract_number() RETURNS TRIGGER AS $$
DECLARE seq_num INT;
BEGIN
  SELECT COALESCE(MAX(CAST(SUBSTRING(contract_number FROM 9) AS INT)), 0) + 1
  INTO seq_num FROM maintenance_contracts WHERE contract_number LIKE 'MT-' || TO_CHAR(NOW(), 'YYYY') || '-%';
  NEW.contract_number := 'MT-' || TO_CHAR(NOW(), 'YYYY') || '-' || LPAD(seq_num::TEXT, 4, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION generate_ticket_number() RETURNS TRIGGER AS $$
DECLARE seq_num INT;
BEGIN
  SELECT COALESCE(MAX(CAST(SUBSTRING(ticket_number FROM 9) AS INT)), 0) + 1
  INTO seq_num FROM tickets WHERE ticket_number LIKE 'TK-' || TO_CHAR(NOW(), 'YYYY') || '-%';
  NEW.ticket_number := 'TK-' || TO_CHAR(NOW(), 'YYYY') || '-' || LPAD(seq_num::TEXT, 4, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 4. TABLES

-- Profiles
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  role user_role DEFAULT 'admin',
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Leads
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_number TEXT UNIQUE,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT NOT NULL,
  company TEXT,
  service_type service_type NOT NULL,
  budget_range TEXT,
  description TEXT NOT NULL,
  status lead_status DEFAULT 'new',
  source lead_source DEFAULT 'website',
  assigned_to UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Lead Notes
CREATE TABLE lead_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES profiles(id),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Clients
CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_number TEXT UNIQUE,
  company_name TEXT NOT NULL,
  business_number TEXT,
  address TEXT,
  notes TEXT,
  lead_id UUID REFERENCES leads(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Client Contacts
CREATE TABLE client_contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  position TEXT,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Client Communications
CREATE TABLE client_communications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  subject TEXT NOT NULL,
  content TEXT NOT NULL,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Meetings
CREATE TABLE meetings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  meeting_date TIMESTAMPTZ NOT NULL,
  duration_minutes INT DEFAULT 60,
  location TEXT,
  meeting_type TEXT DEFAULT 'online',
  lead_id UUID REFERENCES leads(id),
  client_id UUID REFERENCES clients(id),
  organizer_id UUID NOT NULL REFERENCES profiles(id),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Follow Ups
CREATE TABLE follow_ups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meeting_id UUID NOT NULL REFERENCES meetings(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  due_date DATE,
  is_completed BOOLEAN DEFAULT false,
  assigned_to UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Projects
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_number TEXT UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  client_id UUID NOT NULL REFERENCES clients(id),
  service_type service_type NOT NULL,
  status project_status DEFAULT 'planning',
  start_date DATE,
  end_date DATE,
  budget NUMERIC,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Project Members
CREATE TABLE project_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  profile_id UUID NOT NULL REFERENCES profiles(id),
  role TEXT DEFAULT 'developer',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Milestones
CREATE TABLE milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  due_date DATE,
  is_completed BOOLEAN DEFAULT false,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Tasks
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  status task_status DEFAULT 'todo',
  priority task_priority DEFAULT 'medium',
  assigned_to UUID REFERENCES profiles(id),
  due_date DATE,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Requirements
CREATE TABLE requirements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  priority task_priority DEFAULT 'medium',
  is_completed BOOLEAN DEFAULT false,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Invoices
CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_number TEXT UNIQUE,
  project_id UUID NOT NULL REFERENCES projects(id),
  client_id UUID NOT NULL REFERENCES clients(id),
  status invoice_status DEFAULT 'draft',
  issue_date DATE NOT NULL,
  due_date DATE NOT NULL,
  subtotal NUMERIC DEFAULT 0,
  tax NUMERIC DEFAULT 0,
  total NUMERIC DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Invoice Items
CREATE TABLE invoice_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  quantity NUMERIC DEFAULT 1,
  unit_price NUMERIC DEFAULT 0,
  amount NUMERIC DEFAULT 0,
  sort_order INT DEFAULT 0
);

-- Transactions
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID REFERENCES invoices(id),
  amount NUMERIC NOT NULL,
  payment_date DATE NOT NULL,
  payment_method TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Feedback
CREATE TABLE feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id),
  client_id UUID NOT NULL REFERENCES clients(id),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  status feedback_status DEFAULT 'pending',
  priority task_priority DEFAULT 'medium',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Feedback Comments
CREATE TABLE feedback_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  feedback_id UUID NOT NULL REFERENCES feedback(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES profiles(id),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Maintenance Contracts
CREATE TABLE maintenance_contracts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_number TEXT UNIQUE,
  project_id UUID NOT NULL REFERENCES projects(id),
  client_id UUID NOT NULL REFERENCES clients(id),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  monthly_fee NUMERIC NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Tickets
CREATE TABLE tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_number TEXT UNIQUE,
  contract_id UUID NOT NULL REFERENCES maintenance_contracts(id),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  status ticket_status DEFAULT 'open',
  priority ticket_priority DEFAULT 'medium',
  assigned_to UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Ticket Comments
CREATE TABLE ticket_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES profiles(id),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Deliverables
CREATE TABLE deliverables (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  file_url TEXT,
  file_type TEXT,
  version TEXT DEFAULT '1.0',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Attachments
CREATE TABLE attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  table_name TEXT NOT NULL,
  record_id UUID NOT NULL,
  file_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size INT,
  uploaded_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Blog Posts
CREATE TABLE blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  cover_image TEXT,
  category TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  status blog_status DEFAULT 'draft',
  meta_title TEXT,
  meta_description TEXT,
  faq_schema JSONB,
  author_id UUID REFERENCES profiles(id),
  published_at TIMESTAMPTZ,
  scheduled_for TIMESTAMPTZ,
  reading_time INT DEFAULT 0,
  view_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Blog Keywords
CREATE TABLE blog_keywords (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  keyword TEXT NOT NULL,
  service_type service_type,
  industry TEXT,
  search_volume INT,
  difficulty INT,
  is_used BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Audit Logs
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  action TEXT NOT NULL,
  table_name TEXT NOT NULL,
  record_id UUID NOT NULL,
  old_data JSONB,
  new_data JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. INDEXES
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_source ON leads(source);
CREATE INDEX idx_leads_assigned_to ON leads(assigned_to);
CREATE INDEX idx_leads_created_at ON leads(created_at DESC);
CREATE INDEX idx_clients_client_number ON clients(client_number);
CREATE INDEX idx_projects_client_id ON projects(client_id);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_tasks_project_id ON tasks(project_id);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_assigned_to ON tasks(assigned_to);
CREATE INDEX idx_invoices_client_id ON invoices(client_id);
CREATE INDEX idx_invoices_status ON invoices(status);
CREATE INDEX idx_tickets_contract_id ON tickets(contract_id);
CREATE INDEX idx_tickets_status ON tickets(status);
CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX idx_blog_posts_status ON blog_posts(status);
CREATE INDEX idx_blog_posts_category ON blog_posts(category);
CREATE INDEX idx_blog_posts_published_at ON blog_posts(published_at DESC);
CREATE INDEX idx_blog_keywords_service_type ON blog_keywords(service_type);
CREATE INDEX idx_blog_keywords_is_used ON blog_keywords(is_used);
CREATE INDEX idx_audit_logs_table_name ON audit_logs(table_name);
CREATE INDEX idx_audit_logs_record_id ON audit_logs(record_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at DESC);

-- 6. updated_at TRIGGERS
CREATE TRIGGER set_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON leads FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON clients FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON meetings FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON tasks FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON invoices FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON feedback FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON maintenance_contracts FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON tickets FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON blog_posts FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

-- 7. Auto Number TRIGGERS
CREATE TRIGGER set_lead_number BEFORE INSERT ON leads FOR EACH ROW EXECUTE FUNCTION generate_lead_number();
CREATE TRIGGER set_client_number BEFORE INSERT ON clients FOR EACH ROW EXECUTE FUNCTION generate_client_number();
CREATE TRIGGER set_project_number BEFORE INSERT ON projects FOR EACH ROW EXECUTE FUNCTION generate_project_number();
CREATE TRIGGER set_invoice_number BEFORE INSERT ON invoices FOR EACH ROW EXECUTE FUNCTION generate_invoice_number();
CREATE TRIGGER set_contract_number BEFORE INSERT ON maintenance_contracts FOR EACH ROW EXECUTE FUNCTION generate_contract_number();
CREATE TRIGGER set_ticket_number BEFORE INSERT ON tickets FOR EACH ROW EXECUTE FUNCTION generate_ticket_number();

-- 8. RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_communications ENABLE ROW LEVEL SECURITY;
ALTER TABLE meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE follow_ups ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE requirements ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE ticket_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE deliverables ENABLE ROW LEVEL SECURITY;
ALTER TABLE attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_keywords ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Authenticated users can read all
CREATE POLICY "Authenticated read" ON profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated read" ON leads FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated read" ON lead_notes FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated read" ON clients FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated read" ON client_contacts FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated read" ON client_communications FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated read" ON meetings FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated read" ON follow_ups FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated read" ON projects FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated read" ON project_members FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated read" ON milestones FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated read" ON tasks FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated read" ON requirements FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated read" ON invoices FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated read" ON invoice_items FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated read" ON transactions FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated read" ON feedback FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated read" ON feedback_comments FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated read" ON maintenance_contracts FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated read" ON tickets FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated read" ON ticket_comments FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated read" ON deliverables FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated read" ON attachments FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated read" ON blog_keywords FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated read" ON audit_logs FOR SELECT TO authenticated USING (true);

-- Authenticated users can write all (admin enforcement at app level)
CREATE POLICY "Authenticated write" ON profiles FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated write" ON leads FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated write" ON lead_notes FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated write" ON clients FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated write" ON client_contacts FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated write" ON client_communications FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated write" ON meetings FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated write" ON follow_ups FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated write" ON projects FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated write" ON project_members FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated write" ON milestones FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated write" ON tasks FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated write" ON requirements FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated write" ON invoices FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated write" ON invoice_items FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated write" ON transactions FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated write" ON feedback FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated write" ON feedback_comments FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated write" ON maintenance_contracts FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated write" ON tickets FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated write" ON ticket_comments FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated write" ON deliverables FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated write" ON attachments FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated write" ON blog_keywords FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Leads: allow anonymous insert (website form)
CREATE POLICY "Anonymous insert leads" ON leads FOR INSERT TO anon WITH CHECK (true);

-- Blog Posts: public read for published
CREATE POLICY "Public read published" ON blog_posts FOR SELECT TO anon USING (status = 'published');
CREATE POLICY "Authenticated write" ON blog_posts FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 9. Profile auto-create on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();
