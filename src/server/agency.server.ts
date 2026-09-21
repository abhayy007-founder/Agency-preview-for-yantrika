/**
 * Yantrika Agency Backend Server Functions
 * Pattern: TanStack Start createServerFn + Supabase Service Client
 * File: src/server/agency.server.ts
 */

export interface CreateAgencyInput {
  name: string;
  logoUrl?: string;
}

export interface AddClientInput {
  agencyId: string;
  name: string;
  industry: string;
  monthlySpendTarget?: string;
  internalCode?: string;
  platforms?: string[];
}

export interface InviteTeamMemberInput {
  agencyId: string;
  email: string;
  role: 'admin' | 'manager';
  initialClientIds?: string[];
}

export interface AcceptInviteInput {
  inviteId: string;
}

export interface UpdateClientScopeInput {
  agencyMemberId: string;
  businessIds: string[];
}

export interface UpdateAgencyBrandingInput {
  agencyId: string;
  name: string;
  logoUrl?: string;
}

export interface ExportReportInput {
  agencyId: string;
  businessId?: string; // If omitted, portfolio-wide master defense dossier
  monthYear?: string;
}

// In the actual TanStack Start + Supabase codebase, imports are:
// import { createServerFn } from '@tanstack/start';
// import { getSupabaseServerClient } from './supabase.server';

/**
 * 1. createAgency
 * Called during signup when user chooses the "Agency" persona.
 * Creates agency row and automatically assigns caller as 'admin'.
 */
export async function createAgencyServerFn(input: CreateAgencyInput, userId: string, supabase: any) {
  if (!userId) throw new Error('Unauthorized');

  // Insert agency
  const { data: agency, error: agencyErr } = await supabase
    .from('agencies')
    .insert({
      name: input.name,
      logo_url: input.logoUrl,
      owner_user_id: userId
    })
    .select()
    .single();

  if (agencyErr) throw new Error(`Failed to create agency: ${agencyErr.message}`);

  // Insert owner as admin member
  const { error: memberErr } = await supabase
    .from('agency_members')
    .insert({
      agency_id: agency.id,
      user_id: userId,
      role: 'admin'
    });

  if (memberErr) throw new Error(`Failed to initialize agency admin: ${memberErr.message}`);

  return { success: true, agency };
}

/**
 * 2. addClient
 * Creates a new business linked to the agency after verifying membership.
 */
export async function addClientServerFn(input: AddClientInput, userId: string, supabase: any) {
  if (!userId) throw new Error('Unauthorized');

  // Verify caller is member of agency
  const { data: member, error: memberErr } = await supabase
    .from('agency_members')
    .select('id, role')
    .eq('agency_id', input.agencyId)
    .eq('user_id', userId)
    .single();

  if (memberErr || !member) throw new Error('Forbidden: Not an active member of this agency');

  // Create business row with agency_id
  const { data: business, error: bizErr } = await supabase
    .from('businesses')
    .insert({
      name: input.name,
      agency_id: input.agencyId,
      user_id: userId,
      industry: input.industry,
      target_monthly_spend: input.monthlySpendTarget,
      internal_code: input.internalCode
    })
    .select()
    .single();

  if (bizErr) throw new Error(`Failed to add client business: ${bizErr.message}`);

  // If added by a manager, auto-grant scope to creator
  if (member.role === 'manager') {
    await supabase.from('agency_member_client_scope').insert({
      agency_member_id: member.id,
      business_id: business.id
    });
  }

  return { success: true, business };
}

/**
 * 3. inviteTeamMember
 * Admin-only: creates pending invite and triggers auth invitation email.
 */
export async function inviteTeamMemberServerFn(input: InviteTeamMemberInput, userId: string, supabase: any) {
  // Check admin role
  const { data: adminMember } = await supabase
    .from('agency_members')
    .select('id, role')
    .eq('agency_id', input.agencyId)
    .eq('user_id', userId)
    .eq('role', 'admin')
    .single();

  if (!adminMember) throw new Error('Forbidden: Only agency admins can invite members');

  const { data: invite, error: invErr } = await supabase
    .from('agency_pending_invites')
    .insert({
      agency_id: input.agencyId,
      email: input.email.toLowerCase().trim(),
      role: input.role,
      invited_by: userId,
      status: 'pending'
    })
    .select()
    .single();

  if (invErr) throw new Error(`Invite creation failed: ${invErr.message}`);

  // Trigger invite through Supabase Auth inviteUserByEmail
  if (supabase.auth?.admin?.inviteUserByEmail) {
    await supabase.auth.admin.inviteUserByEmail(input.email, {
      data: {
        agency_id: input.agencyId,
        agency_role: input.role,
        invite_id: invite.id
      }
    });
  }

  return { success: true, invite };
}

/**
 * 4. acceptInvite
 * Converts a pending invite into an active agency_members record upon login/signup.
 */
export async function acceptInviteServerFn(input: AcceptInviteInput, userId: string, userEmail: string, supabase: any) {
  const { data: invite, error: invErr } = await supabase
    .from('agency_pending_invites')
    .select('*')
    .eq('id', input.inviteId)
    .eq('status', 'pending')
    .single();

  if (invErr || !invite) throw new Error('Invalid or expired invitation');

  if (invite.email.toLowerCase() !== userEmail.toLowerCase()) {
    throw new Error('Email does not match invitation recipient');
  }

  // Create member row
  const { data: member, error: memberErr } = await supabase
    .from('agency_members')
    .insert({
      agency_id: invite.agency_id,
      user_id: userId,
      role: invite.role
    })
    .select()
    .single();

  if (memberErr) throw new Error(`Failed to join agency: ${memberErr.message}`);

  // Mark invite accepted
  await supabase
    .from('agency_pending_invites')
    .update({ status: 'accepted' })
    .eq('id', invite.id);

  return { success: true, member };
}

/**
 * 5. updateClientScope
 * Admin-only: atomic replacement of manager's assigned client businesses.
 */
export async function updateClientScopeServerFn(input: UpdateClientScopeInput, userId: string, supabase: any) {
  // Verify target member belongs to an agency where caller is admin
  const { data: targetMember } = await supabase
    .from('agency_members')
    .select('id, agency_id')
    .eq('id', input.agencyMemberId)
    .single();

  if (!targetMember) throw new Error('Member not found');

  const { data: callerAdmin } = await supabase
    .from('agency_members')
    .select('id')
    .eq('agency_id', targetMember.agency_id)
    .eq('user_id', userId)
    .eq('role', 'admin')
    .single();

  if (!callerAdmin) throw new Error('Forbidden: Only agency admins can reassign client scope');

  // Atomic wipe and re-insert scope
  const { error: delErr } = await supabase
    .from('agency_member_client_scope')
    .delete()
    .eq('agency_member_id', input.agencyMemberId);

  if (delErr) throw new Error(`Failed clearing old scope: ${delErr.message}`);

  if (input.businessIds.length > 0) {
    const rows = input.businessIds.map((bId) => ({
      agency_member_id: input.agencyMemberId,
      business_id: bId
    }));
    const { error: insErr } = await supabase
      .from('agency_member_client_scope')
      .insert(rows);

    if (insErr) throw new Error(`Failed assigning new scope: ${insErr.message}`);
  }

  return { success: true, count: input.businessIds.length };
}

/**
 * 6. updateAgencyBranding
 * Admin-only: updates agency display name and white-label logo URL.
 */
export async function updateAgencyBrandingServerFn(input: UpdateAgencyBrandingInput, userId: string, supabase: any) {
  const { data: adminMember } = await supabase
    .from('agency_members')
    .select('id')
    .eq('agency_id', input.agencyId)
    .eq('user_id', userId)
    .eq('role', 'admin')
    .single();

  if (!adminMember) throw new Error('Forbidden: Only agency admins can update branding');

  const { data: agency, error: updateErr } = await supabase
    .from('agencies')
    .update({
      name: input.name,
      logo_url: input.logoUrl
    })
    .eq('id', input.agencyId)
    .select()
    .single();

  if (updateErr) throw new Error(`Failed updating branding: ${updateErr.message}`);

  return { success: true, agency };
}

/**
 * 7. exportClientReport / exportAgencyReport
 * Generates white-labeled PDF data using agency logo & branding instead of Yantrika.
 */
export async function exportReportServerFn(input: ExportReportInput, userId: string, supabase: any) {
  // Fetch agency branding
  const { data: agency } = await supabase
    .from('agencies')
    .select('id, name, logo_url')
    .eq('id', input.agencyId)
    .single();

  if (!agency) throw new Error('Agency not found');

  if (input.businessId) {
    // Single client audit report
    const { data: business } = await supabase
      .from('businesses')
      .select('*, signals(*), reports(*)')
      .eq('id', input.businessId)
      .single();

    return {
      type: 'client_audit',
      brand: {
        agencyName: agency.name,
        agencyLogo: agency.logo_url
      },
      business,
      generatedAt: new Date().toISOString()
    };
  }

  // Portfolio-wide master retainer defense report
  const { data: businesses } = await supabase
    .from('businesses')
    .select('id, name, industry, signals(*)')
    .eq('agency_id', input.agencyId);

  return {
    type: 'portfolio_defense_dossier',
    brand: {
      agencyName: agency.name,
      agencyLogo: agency.logo_url
    },
    clientCount: businesses?.length || 0,
    generatedAt: new Date().toISOString()
  };
}
