/**
 * GET /api/agent/workspace — non-secret workspace identity/config descriptor
 * (APBM001, AC003–AC005).
 *
 * Returns the verified server user, chat mode, public Supabase project ref,
 * and per manifest agent its opaque backend_key plus availability from the
 * bundle's /list-apps roster (cached; a failed lookup is `unknown`, never
 * absence). Endpoints, env names and credentials never leave the server.
 * The manifest itself is only read — unavailable agents stay listed.
 */

import { NextResponse } from 'next/server';

import { MANIFEST } from '@/config/manifest';
import type { AgentAvailability, WorkspaceDescriptor } from '@/types';

import {
  RouteError,
  backendKeyFor,
  chatMode,
  errorResponse,
  loadRoster,
  requireUser,
  resolveAgentTarget,
  supabaseProjectRef,
  type AgentTarget,
} from '../_lib/context';

export const maxDuration = 65;

export async function GET(req: Request) {
  try {
    const user = await requireUser();
    const mode = chatMode();
    const agents: WorkspaceDescriptor['agents'] = [];
    let rosterCheckedAt: number | null = null;
    for (const agent of MANIFEST.agents) {
      if (mode === 'mock') {
        agents.push({
          agent_name: agent.name,
          backend_key: backendKeyFor('mock', agent.bundle, 'mock'),
          availability: 'available',
        });
        continue;
      }
      let target: AgentTarget;
      try {
        target = resolveAgentTarget(agent.name);
      } catch (e) {
        if (!(e instanceof RouteError)) throw e;
        agents.push({
          agent_name: agent.name,
          backend_key: null,
          availability: 'config-unavailable',
        });
        continue;
      }
      const roster = await loadRoster(target, req.signal);
      rosterCheckedAt = Math.max(rosterCheckedAt ?? 0, roster.checkedAt);
      const availability: AgentAvailability = !roster.apps
        ? 'unknown'
        : roster.apps.includes(agent.name)
          ? 'available'
          : 'unavailable';
      agents.push({
        agent_name: agent.name,
        backend_key: target.backendKey,
        availability,
      });
    }
    const descriptor: WorkspaceDescriptor = {
      user,
      mode,
      supabase_ref: supabaseProjectRef(),
      agents,
      roster_checked_at: rosterCheckedAt ? new Date(rosterCheckedAt).toISOString() : null,
    };
    return NextResponse.json(descriptor, {
      status: 200,
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch (e) {
    return errorResponse(e);
  }
}
