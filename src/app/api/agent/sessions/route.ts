/**
 * /api/agent/sessions — ADK conversation catalogue (APBM001, R001-02).
 *
 * GET  ?agent_name=&backend_key=[&user_id=] → ListSessionsResponse
 *      Successful zero rows is `empty`; every failure is a structured error.
 * POST CreateSessionRequest → CreateSessionResponse
 *      Explicit create of a client-allocated UUID with its initial title as
 *      ADK session state. One upstream attempt; never a run.
 *
 * The server user selects the ADK namespace; browser identity is only an
 * assertion that must match (R001-11). No chat_sessions access.
 *
 * @see agent_docs/ACTIONS/stark_agent_workspace_apbm_001/DATA_CONTRACT.md
 */

import { NextResponse } from 'next/server';

import type { CreateSessionResponse, ListSessionsResponse } from '@/types';

import { createSession, listSessions, normalizeTitle } from '../_lib/adk';
import {
  RouteError,
  assertSameOrigin,
  authorizeAgentRequest,
  errorResponse,
  readJsonObject,
  requireSessionId,
} from '../_lib/context';

export const maxDuration = 65;

export async function GET(req: Request) {
  try {
    const params = new URL(req.url).searchParams;
    const { user, target } = await authorizeAgentRequest({
      agent: params.get('agent_name'),
      userId: params.get('user_id'),
      backendKey: params.get('backend_key'),
    });
    const sessions = await listSessions(target, user.id, req.signal);
    const body: ListSessionsResponse = {
      status: sessions.length ? 'ready' : 'empty',
      sessions,
      backend_key: target.backendKey,
    };
    return NextResponse.json(body, { status: 200 });
  } catch (e) {
    return errorResponse(e);
  }
}

export async function POST(req: Request) {
  try {
    assertSameOrigin(req);
    const body = await readJsonObject(req);
    const sessionId = requireSessionId(body.session_id, { uuid: true });
    const title = normalizeTitle(body.title);
    if (!title) throw new RouteError(400, 'invalid-request', 'A title is required');
    const { user, target } = await authorizeAgentRequest({
      agent: body.agent_name,
      userId: body.user_id,
      backendKey: body.backend_key,
    });
    const { createdAt } = await createSession(
      target,
      user.id,
      sessionId,
      title,
      req.signal,
    );
    const created: CreateSessionResponse = {
      status: 'created',
      session_id: sessionId,
      title,
      created_at: createdAt,
    };
    return NextResponse.json(created, { status: 200 });
  } catch (e) {
    return errorResponse(e);
  }
}
