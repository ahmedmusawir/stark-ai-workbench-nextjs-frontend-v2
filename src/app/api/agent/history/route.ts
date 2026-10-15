/**
 * POST /api/agent/history — native ADK connector (BIM-002, APBM001).
 *
 * Accepts `{ agent_name, session_id, backend_key?, user_id? }` →
 * `{ status: 'ready' | 'empty', history: Message[] }`.
 * APBM001 (R001-05) supersedes the frozen A1 error shape: failures are
 * structured `{ error: { code, message } }` — session 404 `session-missing`,
 * upstream auth `upstream-access`, timeout/5xx/malformed unavailable — so no
 * caller can mistake a failure for an empty conversation. The verified server
 * user selects the ADK namespace; browser Authorization is not forwarded.
 *
 * @see agent_docs/ACTIONS/stark_agent_workspace_apbm_001/DATA_CONTRACT.md
 */

import { NextResponse } from 'next/server';

import type { HistoryResponseWire } from '@/types';

import { getSessionHistory } from '../_lib/adk';
import {
  assertSameOrigin,
  authorizeAgentRequest,
  errorResponse,
  readJsonObject,
  requireSessionId,
} from '../_lib/context';

export const maxDuration = 65;

export async function POST(req: Request) {
  try {
    assertSameOrigin(req);
    const body = await readJsonObject(req);
    const sessionId = requireSessionId(body.session_id, { uuid: false });
    const { user, target } = await authorizeAgentRequest({
      agent: body.agent_name,
      userId: body.user_id,
      backendKey: body.backend_key,
    });
    const history = await getSessionHistory(target, user.id, sessionId, req.signal);
    const result: HistoryResponseWire = {
      status: history.length ? 'ready' : 'empty',
      history,
    };
    return NextResponse.json(result, { status: 200 });
  } catch (e) {
    return errorResponse(e);
  }
}
