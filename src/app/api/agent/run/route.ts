/**
 * POST /api/agent/run — native ADK connector (BIM-002, APBM001).
 *
 * Continuation only: `{ agent_name, session_id, message, backend_key?,
 * user_id? }` → `{ status: 'sent', response, session_id, event_ids,
 * invocation_id }`. One camelCase upstream `/run` attempt. APBM001 (R001-06)
 * retires the null-session bootstrap and the not-found→create→retry loop:
 * a missing session is `session-missing` (404) and is never recreated or
 * resent. New conversations are created explicitly via /api/agent/sessions.
 *
 * @see agent_docs/ACTIONS/stark_agent_workspace_apbm_001/DATA_CONTRACT.md
 */

import { NextResponse } from 'next/server';

import type { RunTurnResponse } from '@/types';

import { runTurn } from '../_lib/adk';
import {
  assertSameOrigin,
  authorizeAgentRequest,
  errorResponse,
  readJsonObject,
  requireMessage,
  requireSessionId,
} from '../_lib/context';

// 90s upstream run budget plus a small margin; a host with a shorter limit
// is a deployment incompatibility to report, not to widen silently.
export const maxDuration = 95;

export async function POST(req: Request) {
  try {
    assertSameOrigin(req);
    const body = await readJsonObject(req);
    const sessionId = requireSessionId(body.session_id, { uuid: false });
    const message = requireMessage(body.message);
    const { user, target } = await authorizeAgentRequest({
      agent: body.agent_name,
      userId: body.user_id,
      backendKey: body.backend_key,
    });
    const turn = await runTurn(target, user.id, sessionId, message, req.signal);
    const result: RunTurnResponse = {
      status: 'sent',
      response: turn.reply,
      session_id: sessionId,
      event_ids: turn.eventIds,
      invocation_id: turn.invocationId,
    };
    return NextResponse.json(result, { status: 200 });
  } catch (e) {
    return errorResponse(e);
  }
}
