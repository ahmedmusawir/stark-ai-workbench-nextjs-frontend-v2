/**
 * Same-browser recovery journal for unconfirmed sends (APBM001 DATA_CONTRACT
 * "First-send transaction and recovery").
 *
 * A record holds only scoped identity, operation ID, stage and time — never
 * message text, transcripts, tokens, endpoints or thought data. It is not a
 * conversation catalogue or a delivery authority: ADK history stays
 * authoritative, and a record only keeps an uncertain send visible until the
 * user explicitly acknowledges it. Storage failures surface to the caller so
 * a send can be refused before any network write.
 */

export const JOURNAL_KEY = 'stark-workspace-recovery-v1';
const MAX_RECORDS = 50;
const MAX_STORED_CHARS = 32_768;
const MAX_FIELD_CHARS = 200;

/** create = UUID allocated, create not yet confirmed; run = create confirmed, run dispatched. */
export type JournalStage = 'create' | 'run' | 'uncertain';

export interface JournalRecord {
  v: 1;
  op: string;
  user: string;
  mode: string;
  backend: string;
  agent: string;
  session: string;
  draft?: string;
  stage: JournalStage;
  at: number;
}

export interface JournalScope {
  user: string;
  mode: string;
}

/** Storage is unreadable or unwritable; callers must not dispatch a send. */
export class JournalUnavailableError extends Error {}

const field = (value: unknown): value is string =>
  typeof value === 'string' && value.length > 0 && value.length <= MAX_FIELD_CHARS;

function isRecord(value: unknown): value is JournalRecord {
  const r = value as Partial<JournalRecord> | null;
  return (
    !!r &&
    r.v === 1 &&
    field(r.op) &&
    field(r.user) &&
    field(r.mode) &&
    typeof r.backend === 'string' &&
    r.backend.length <= MAX_FIELD_CHARS &&
    field(r.agent) &&
    field(r.session) &&
    (r.draft === undefined || field(r.draft)) &&
    (r.stage === 'create' || r.stage === 'run' || r.stage === 'uncertain') &&
    typeof r.at === 'number' &&
    Number.isFinite(r.at)
  );
}

/** Only known fields survive a write — nothing else can ride along. */
const strip = (r: JournalRecord): JournalRecord => ({
  v: 1,
  op: r.op,
  user: r.user,
  mode: r.mode,
  backend: r.backend,
  agent: r.agent,
  session: r.session,
  ...(r.draft ? { draft: r.draft } : {}),
  stage: r.stage,
  at: r.at,
});

function storage(): Storage {
  try {
    const store = window.localStorage;
    if (!store) throw new Error('no storage');
    return store;
  } catch {
    throw new JournalUnavailableError('Recovery storage unavailable');
  }
}

/** Every valid record; malformed or oversize content is ignored, never fatal. */
function readAll(): JournalRecord[] {
  let raw: string | null;
  try {
    raw = storage().getItem(JOURNAL_KEY);
  } catch {
    throw new JournalUnavailableError('Recovery storage unavailable');
  }
  if (!raw || raw.length > MAX_STORED_CHARS) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter(isRecord).slice(0, MAX_RECORDS) : [];
  } catch {
    return [];
  }
}

function writeAll(records: JournalRecord[]): void {
  const raw = JSON.stringify(records.map(strip));
  if (records.length > MAX_RECORDS || raw.length > MAX_STORED_CHARS) {
    throw new JournalUnavailableError('Recovery storage is full');
  }
  try {
    const store = storage();
    store.setItem(JOURNAL_KEY, raw);
    // A write that does not read back is not durable enough to send behind.
    if (store.getItem(JOURNAL_KEY) !== raw) throw new Error('not persisted');
  } catch {
    throw new JournalUnavailableError('Recovery storage unavailable');
  }
}

/** Records for the same server-verified user and mode; [] when storage is unreadable. */
export function readJournal(scope: JournalScope): JournalRecord[] {
  try {
    return readAll().filter((r) => r.user === scope.user && r.mode === scope.mode);
  } catch {
    return [];
  }
}

/** Insert or replace by operation ID. Throws JournalUnavailableError. */
export function saveRecord(record: JournalRecord): void {
  if (!isRecord(record)) throw new JournalUnavailableError('Invalid recovery record');
  const others = readAll().filter((r) => r.op !== record.op);
  writeAll([...others, record]);
}

/** Best-effort removal; false when storage could not be updated. */
export function removeRecord(op: string): boolean {
  try {
    const all = readAll();
    if (all.some((r) => r.op === op)) writeAll(all.filter((r) => r.op !== op));
    return true;
  } catch {
    return false;
  }
}

/** RFC 4122 v4 ID; getRandomValues also works where randomUUID is unavailable. */
export function newId(): string {
  if (typeof crypto.randomUUID === 'function') return crypto.randomUUID();
  const b = crypto.getRandomValues(new Uint8Array(16));
  b[6] = (b[6] & 0x0f) | 0x40;
  b[8] = (b[8] & 0x3f) | 0x80;
  const h = Array.from(b, (x) => x.toString(16).padStart(2, '0')).join('');
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`;
}

/** Short opaque draft identity carried in the URL (`new=d…`). */
export const newDraftId = (): string => 'd' + newId().replace(/-/g, '').slice(0, 8);
