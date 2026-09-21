import React, { useState } from 'react';

interface SchemaSpecScreenProps {
  onShowToast: (msg: string) => void;
}

export const SchemaSpecScreen: React.FC<SchemaSpecScreenProps> = ({ onShowToast }) => {
  const [activeTab, setActiveTab] = useState<'sql' | 'server' | 'rls'>('sql');

  const sqlMigrationCode = `-- ==============================================================================
-- YANTRIKA AGENCY MODEL MIGRATION (Supabase PostgreSQL)
-- Migration: 20260921000000_agency_multi_tenant_schema.sql
-- ==============================================================================

-- 1. Agencies table
CREATE TABLE public.agencies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    logo_url TEXT,
    owner_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.agencies ENABLE ROW LEVEL SECURITY;

-- 2. Link businesses to agency
ALTER TABLE public.businesses
ADD COLUMN agency_id UUID REFERENCES public.agencies(id) ON DELETE CASCADE;
CREATE INDEX idx_businesses_agency_id ON public.businesses(agency_id);

-- 3. Agency members with RBAC ('admin' | 'manager')
CREATE TABLE public.agency_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agency_id UUID NOT NULL REFERENCES public.agencies(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('admin', 'manager')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_agency_member UNIQUE (agency_id, user_id)
);
ALTER TABLE public.agency_members ENABLE ROW LEVEL SECURITY;

-- 4. Granular client isolation scope for managers
CREATE TABLE public.agency_member_client_scope (
    agency_member_id UUID NOT NULL REFERENCES public.agency_members(id) ON DELETE CASCADE,
    business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (agency_member_id, business_id)
);
ALTER TABLE public.agency_member_client_scope ENABLE ROW LEVEL SECURITY;

-- 5. Pending invites with email / magic link
CREATE TABLE public.agency_pending_invites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agency_id UUID NOT NULL REFERENCES public.agencies(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('admin', 'manager')),
    invited_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'revoked'))
);
ALTER TABLE public.agency_pending_invites ENABLE ROW LEVEL SECURITY;

-- 6. Comprehensive RLS function: can_access_business(business_id)
CREATE OR REPLACE FUNCTION public.can_access_business(target_business_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
AS $$
DECLARE
    current_uid UUID := auth.uid();
    v_owner_uid UUID;
    v_agency_id UUID;
    v_role TEXT;
    v_member_id UUID;
BEGIN
    IF current_uid IS NULL THEN RETURN FALSE; END IF;

    SELECT b.user_id, b.agency_id INTO v_owner_uid, v_agency_id
    FROM public.businesses b WHERE b.id = target_business_id;

    IF NOT FOUND THEN RETURN FALSE; END IF;

    -- Solo owner case
    IF v_owner_uid = current_uid THEN RETURN TRUE; END IF;

    -- Agency member case
    IF v_agency_id IS NOT NULL THEN
        SELECT am.id, am.role INTO v_member_id, v_role
        FROM public.agency_members am
        WHERE am.agency_id = v_agency_id AND am.user_id = current_uid;

        IF FOUND THEN
            IF v_role = 'admin' THEN RETURN TRUE; END IF;
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
$$;`;

  const serverFunctionsCode = `/**
 * TanStack Start Server Functions (.server.ts)
 * src/server/agency.server.ts
 */
export const createAgency = createServerFn({ method: 'POST' })
  .validator((d: { name: string; logoUrl?: string }) => d)
  .handler(async ({ data, context }) => {
    // 1. Creates agencies row (owner_user_id = auth.uid())
    // 2. Inserts caller into agency_members with role='admin'
  });

export const addClient = createServerFn({ method: 'POST' })
  .validator((d: { agencyId: string; name: string; industry: string; budget: string }) => d)
  .handler(async ({ data, context }) => {
    // Verifies admin or manager membership, creates businesses row with agency_id
  });

export const inviteTeamMember = createServerFn({ method: 'POST' })
  .validator((d: { agencyId: string; email: string; role: 'admin' | 'manager' }) => d)
  .handler(async ({ data, context }) => {
    // Admin only: inserts agency_pending_invites and triggers Supabase inviteUserByEmail
  });

export const acceptInvite = createServerFn({ method: 'POST' })
  .validator((d: { inviteId: string }) => d)
  .handler(async ({ data, context }) => {
    // Converts pending invite to agency_members upon sign-up
  });

export const updateClientScope = createServerFn({ method: 'POST' })
  .validator((d: { agencyMemberId: string; businessIds: string[] }) => d)
  .handler(async ({ data, context }) => {
    // Admin only: atomic replacement of agency_member_client_scope
  });

export const updateAgencyBranding = createServerFn({ method: 'POST' })
  .validator((d: { agencyId: string; name: string; logoUrl?: string }) => d)
  .handler(async ({ data, context }) => {
    // Sets logo_url & display name for client white-label reports
  });

export const exportClientReport = createServerFn({ method: 'GET' })
  .validator((d: { agencyId: string; businessId?: string }) => d)
  .handler(async ({ data, context }) => {
    // Renders PDF using agency's white-label logo/name instead of Yantrika
  });`;

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    onShowToast(`Copied ${label} to clipboard!`);
  };

  return (
    <div className="flex flex-col w-full text-[#dbe1ff] px-3 sm:px-4 max-w-xl mx-auto space-y-4 pt-2 pb-24">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-1.5">
          <span className="material-symbols-outlined text-[#42A5F5] text-[18px]">terminal</span>
          <span className="font-mono text-[10px] uppercase tracking-wider text-[#42A5F5] font-semibold">
            Engineering &amp; Migration Spec
          </span>
        </div>
        <h1 className="text-[22px] font-bold text-white tracking-tight">
          Agency Architecture
        </h1>
        <p className="text-[12px] text-[#cbc3d5]">
          Production schema changes, RLS refactor policies, and TanStack Start backend server functions for the Yantrika multi-tenant migration.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 p-1 bg-[#131b32] rounded-xl border border-[#212941]">
        <button
          onClick={() => setActiveTab('sql')}
          className={`flex-1 py-1.5 rounded-lg font-mono text-[11px] font-medium transition-all ${
            activeTab === 'sql' ? 'bg-[#0070dd] text-white shadow' : 'text-[#cbc3d5]'
          }`}
        >
          Supabase SQL
        </button>
        <button
          onClick={() => setActiveTab('server')}
          className={`flex-1 py-1.5 rounded-lg font-mono text-[11px] font-medium transition-all ${
            activeTab === 'server' ? 'bg-[#0070dd] text-white shadow' : 'text-[#cbc3d5]'
          }`}
        >
          Server Functions
        </button>
        <button
          onClick={() => setActiveTab('rls')}
          className={`flex-1 py-1.5 rounded-lg font-mono text-[11px] font-medium transition-all ${
            activeTab === 'rls' ? 'bg-[#0070dd] text-white shadow' : 'text-[#cbc3d5]'
          }`}
        >
          RLS Matrix
        </button>
      </div>

      {activeTab === 'sql' && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] text-[#cbc3d5]">
              /supabase/migrations/20260921000000_agency_multi_tenant_schema.sql
            </span>
            <button
              onClick={() => copyToClipboard(sqlMigrationCode, 'SQL migration')}
              className="flex items-center gap-1 text-[11px] text-[#42A5F5] hover:underline"
            >
              <span className="material-symbols-outlined text-[14px]">content_copy</span>
              <span>Copy SQL</span>
            </button>
          </div>
          <pre className="p-3 bg-[#0a0f1d] border border-[#212941] rounded-xl text-[11px] font-mono text-[#aac7ff] overflow-x-auto max-h-[500px]">
            {sqlMigrationCode}
          </pre>
        </div>
      )}

      {activeTab === 'server' && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] text-[#cbc3d5]">
              /src/server/agency.server.ts (TanStack Start createServerFn)
            </span>
            <button
              onClick={() => copyToClipboard(serverFunctionsCode, 'Server functions')}
              className="flex items-center gap-1 text-[11px] text-[#42A5F5] hover:underline"
            >
              <span className="material-symbols-outlined text-[14px]">content_copy</span>
              <span>Copy TS</span>
            </button>
          </div>
          <pre className="p-3 bg-[#0a0f1d] border border-[#212941] rounded-xl text-[11px] font-mono text-[#d1bcff] overflow-x-auto max-h-[500px]">
            {serverFunctionsCode}
          </pre>
        </div>
      )}

      {activeTab === 'rls' && (
        <div className="flex flex-col gap-3 p-4 bg-[#131b32] border border-[#212941] rounded-xl">
          <h2 className="text-[14px] font-semibold text-white">Multi-Tenant Access Evaluation Matrix</h2>
          <div className="space-y-2 text-[12px]">
            <div className="p-2.5 rounded-lg bg-[#171f36] flex flex-col gap-1">
              <span className="font-mono text-[11px] text-[#10B981] font-semibold">1. Solo Business Owner</span>
              <p className="text-[#cbc3d5]">
                <code>businesses.user_id = auth.uid()</code>. Existing solo accounts retain 100% backward compatibility.
              </p>
            </div>
            <div className="p-2.5 rounded-lg bg-[#171f36] flex flex-col gap-1">
              <span className="font-mono text-[11px] text-[#42A5F5] font-semibold">2. Agency Admin</span>
              <p className="text-[#cbc3d5]">
                <code>agency_members.role = &apos;admin&apos;</code>. Implicit access to all client businesses, billing, and team configuration.
              </p>
            </div>
            <div className="p-2.5 rounded-lg bg-[#171f36] flex flex-col gap-1">
              <span className="font-mono text-[11px] text-[#d1bcff] font-semibold">3. Agency Manager (Media Buyer)</span>
              <p className="text-[#cbc3d5]">
                <code>agency_members.role = &apos;manager&apos;</code>. Access strictly firewalled to businesses in <code>agency_member_client_scope</code>.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
