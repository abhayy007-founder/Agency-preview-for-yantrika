-- ==============================================================================
-- YANTRIKA AGENCY MODEL MIGRATION
-- Migration: 20260921000000_agency_multi_tenant_schema.sql
-- Description: Multi-seat agency governance, client isolation scoping, and RLS refactor.
-- ==============================================================================

-- 1. Create agencies table
CREATE TABLE IF NOT EXISTS public.agencies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    logo_url TEXT,
    owner_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on agencies
ALTER TABLE public.agencies ENABLE ROW LEVEL SECURITY;

-- 2. Add agency_id to businesses table
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
          AND table_name = 'businesses' 
          AND column_name = 'agency_id'
    ) THEN
        ALTER TABLE public.businesses
        ADD COLUMN agency_id UUID REFERENCES public.agencies(id) ON DELETE CASCADE;
    END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_businesses_agency_id ON public.businesses(agency_id);

-- 3. Create agency_members table
CREATE TABLE IF NOT EXISTS public.agency_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agency_id UUID NOT NULL REFERENCES public.agencies(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('admin', 'manager')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_agency_member UNIQUE (agency_id, user_id)
);

-- Enable RLS on agency_members
ALTER TABLE public.agency_members ENABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS idx_agency_members_user ON public.agency_members(user_id);
CREATE INDEX IF NOT EXISTS idx_agency_members_agency ON public.agency_members(agency_id);

-- 4. Create agency_member_client_scope table (client-level scoping for managers)
CREATE TABLE IF NOT EXISTS public.agency_member_client_scope (
    agency_member_id UUID NOT NULL REFERENCES public.agency_members(id) ON DELETE CASCADE,
    business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (agency_member_id, business_id)
);

-- Enable RLS on client scope
ALTER TABLE public.agency_member_client_scope ENABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS idx_client_scope_business ON public.agency_member_client_scope(business_id);

-- 5. Create agency_pending_invites table
CREATE TABLE IF NOT EXISTS public.agency_pending_invites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agency_id UUID NOT NULL REFERENCES public.agencies(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('admin', 'manager')),
    invited_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'revoked'))
);

-- Enable RLS on pending invites
ALTER TABLE public.agency_pending_invites ENABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS idx_pending_invites_agency ON public.agency_pending_invites(agency_id);
CREATE INDEX IF NOT EXISTS idx_pending_invites_email ON public.agency_pending_invites(email);

-- ==============================================================================
-- PART 1.6 — RLS REFACTOR: can_access_business(business_id)
-- ==============================================================================

-- Preserve existing owns_business(business_id) for solo-owner specific operations
CREATE OR REPLACE FUNCTION public.owns_business(target_business_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.businesses b
        WHERE b.id = target_business_id
          AND b.user_id = auth.uid()
    );
$$;

-- New multi-tenant access function supporting both Solo Owners and Agency Teams
CREATE OR REPLACE FUNCTION public.can_access_business(target_business_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
AS $$
DECLARE
    current_uid UUID;
    v_owner_uid UUID;
    v_agency_id UUID;
    v_role TEXT;
    v_member_id UUID;
BEGIN
    current_uid := auth.uid();
    IF current_uid IS NULL THEN
        RETURN FALSE;
    END IF;

    -- Look up the target business
    SELECT b.user_id, b.agency_id
    INTO v_owner_uid, v_agency_id
    FROM public.businesses b
    WHERE b.id = target_business_id;

    IF NOT FOUND THEN
        RETURN FALSE;
    END IF;

    -- 1. Direct solo owner access
    IF v_owner_uid = current_uid THEN
        RETURN TRUE;
    END IF;

    -- 2. Agency-managed access
    IF v_agency_id IS NOT NULL THEN
        SELECT am.id, am.role
        INTO v_member_id, v_role
        FROM public.agency_members am
        WHERE am.agency_id = v_agency_id
          AND am.user_id = current_uid;

        IF FOUND THEN
            -- Agency Admins have implicit access to every client under this agency
            IF v_role = 'admin' THEN
                RETURN TRUE;
            END IF;

            -- Agency Managers must have an explicit row in agency_member_client_scope
            IF v_role = 'manager' THEN
                RETURN EXISTS (
                    SELECT 1 FROM public.agency_member_client_scope amcs
                    WHERE amcs.agency_member_id = v_member_id
                      AND amcs.business_id = target_business_id
                );
            END IF;
        END IF;
    END IF;

    RETURN FALSE;
END;
$$;

-- Function to check if user is an agency admin
CREATE OR REPLACE FUNCTION public.is_agency_admin(target_agency_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.agency_members am
        WHERE am.agency_id = target_agency_id
          AND am.user_id = auth.uid()
          AND am.role = 'admin'
    );
$$;

-- ==============================================================================
-- RLS POLICIES FOR AGENCIES & MEMBERS
-- ==============================================================================

-- Agencies policies
DROP POLICY IF EXISTS "Agency members can view their agency" ON public.agencies;
CREATE POLICY "Agency members can view their agency" ON public.agencies
    FOR SELECT USING (
        owner_user_id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM public.agency_members am 
            WHERE am.agency_id = agencies.id AND am.user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Agency owners and admins can update agency" ON public.agencies;
CREATE POLICY "Agency owners and admins can update agency" ON public.agencies
    FOR UPDATE USING (
        owner_user_id = auth.uid() OR public.is_agency_admin(agencies.id)
    );

-- Agency members policies
DROP POLICY IF EXISTS "Agency members can view co-workers" ON public.agency_members;
CREATE POLICY "Agency members can view co-workers" ON public.agency_members
    FOR SELECT USING (
        user_id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM public.agency_members am2 
            WHERE am2.agency_id = agency_members.agency_id AND am2.user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Admins can manage agency members" ON public.agency_members;
CREATE POLICY "Admins can manage agency members" ON public.agency_members
    FOR ALL USING (public.is_agency_admin(agency_members.agency_id));

-- Agency member client scope policies
DROP POLICY IF EXISTS "Members can view scope" ON public.agency_member_client_scope;
CREATE POLICY "Members can view scope" ON public.agency_member_client_scope
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.agency_members am
            WHERE am.id = agency_member_client_scope.agency_member_id
              AND (am.user_id = auth.uid() OR public.is_agency_admin(am.agency_id))
        )
    );

DROP POLICY IF EXISTS "Admins can update client scopes" ON public.agency_member_client_scope;
CREATE POLICY "Admins can update client scopes" ON public.agency_member_client_scope
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.agency_members am
            WHERE am.id = agency_member_client_scope.agency_member_id
              AND public.is_agency_admin(am.agency_id)
        )
    );

-- Pending invites policies
DROP POLICY IF EXISTS "Admins can view and manage invites" ON public.agency_pending_invites;
CREATE POLICY "Admins can view and manage invites" ON public.agency_pending_invites
    FOR ALL USING (public.is_agency_admin(agency_pending_invites.agency_id));

-- ==============================================================================
-- SWAP RLS ON EXISTING WORKSPACE TABLES (USING can_access_business)
-- ==============================================================================

-- 1. businesses table
DROP POLICY IF EXISTS "Users can view accessible businesses" ON public.businesses;
CREATE POLICY "Users can view accessible businesses" ON public.businesses
    FOR SELECT USING (public.can_access_business(id));

DROP POLICY IF EXISTS "Admins and owners can update businesses" ON public.businesses;
CREATE POLICY "Admins and owners can update businesses" ON public.businesses
    FOR UPDATE USING (
        user_id = auth.uid() OR 
        (agency_id IS NOT NULL AND public.is_agency_admin(agency_id))
    );

-- 2. ad_account_connections table
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'ad_account_connections') THEN
        DROP POLICY IF EXISTS "Access ad_account_connections via can_access_business" ON public.ad_account_connections;
        CREATE POLICY "Access ad_account_connections via can_access_business" ON public.ad_account_connections
            FOR ALL USING (public.can_access_business(business_id));
    END IF;
END $$;

-- 3. signals table
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'signals') THEN
        DROP POLICY IF EXISTS "Access signals via can_access_business" ON public.signals;
        CREATE POLICY "Access signals via can_access_business" ON public.signals
            FOR ALL USING (public.can_access_business(business_id));
    END IF;
END $$;

-- 4. confirmed_patterns table
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'confirmed_patterns') THEN
        DROP POLICY IF EXISTS "Access confirmed_patterns via can_access_business" ON public.confirmed_patterns;
        CREATE POLICY "Access confirmed_patterns via can_access_business" ON public.confirmed_patterns
            FOR ALL USING (public.can_access_business(business_id));
    END IF;
END $$;

-- 5. reports table
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'reports') THEN
        DROP POLICY IF EXISTS "Access reports via can_access_business" ON public.reports;
        CREATE POLICY "Access reports via can_access_business" ON public.reports
            FOR ALL USING (public.can_access_business(business_id));
    END IF;
END $$;

-- 6. user_preferences table
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'user_preferences') THEN
        DROP POLICY IF EXISTS "Access user_preferences via can_access_business" ON public.user_preferences;
        CREATE POLICY "Access user_preferences via can_access_business" ON public.user_preferences
            FOR ALL USING (public.can_access_business(business_id));
    END IF;
END $$;
