-- APBM001 P0-2 — public.chat_sessions catalog metadata. OWNER-RUN, READ-ONLY.
--
-- Reads PostgreSQL system catalogs only (pg_class, pg_attribute, pg_attrdef,
-- pg_constraint, pg_indexes, pg_policies, pg_trigger, pg_roles, ACL entries,
-- information_schema.tables). It reads NO application rows: there is no SELECT
-- from public.chat_sessions or from any ADK table, and it changes nothing.
--
-- Run ONCE: Supabase Dashboard → the project whose ref P0-1 printed → SQL Editor
-- → New query → paste this whole file → Run. The result is one row with one
-- column, "p0_chat_sessions_metadata" (JSON). Copy that cell into p0_2_result.json.
-- If the table does not exist, "table_exists" is false and the table-specific
-- sections are null or empty.
--
-- Expected values from the checked-in supabase/chat_sessions_setup.sql, for comparison:
--   columns id uuid default gen_random_uuid(), user_id uuid NOT NULL → auth.users ON DELETE CASCADE,
--   agent_name text NOT NULL, adk_session_id text NOT NULL, title text NOT NULL default 'New chat',
--   created_at/updated_at timestamptz NOT NULL default now(), archived boolean NOT NULL default false;
--   UNIQUE (user_id, agent_name, adk_session_id); RLS enabled; policies SELECT/INSERT/UPDATE
--   to authenticated with auth.uid() = user_id; no DELETE policy; index chat_sessions_list_idx.
WITH t AS (
  SELECT to_regclass('public.chat_sessions') AS rel
)
SELECT jsonb_pretty(jsonb_build_object(
  'p0_query', 'APBM001-P0-2 chat_sessions catalog v1',
  'captured_at', now(),
  'server_version', current_setting('server_version'),
  'database', current_database(),
  'table_exists', (SELECT t.rel IS NOT NULL FROM t),
  'relation', (
    SELECT jsonb_build_object(
      'relkind', c.relkind::text,
      'owner', pg_get_userbyid(c.relowner)::text,
      'rls_enabled', c.relrowsecurity,
      'rls_forced', c.relforcerowsecurity)
    FROM t JOIN pg_class c ON c.oid = t.rel),
  'columns', (
    SELECT coalesce(jsonb_agg(jsonb_build_object(
      'position', a.attnum,
      'name', a.attname::text,
      'type', format_type(a.atttypid, a.atttypmod),
      'not_null', a.attnotnull,
      'default', pg_get_expr(d.adbin, d.adrelid),
      'identity', nullif(a.attidentity::text, ''),
      'generated', nullif(a.attgenerated::text, '')) ORDER BY a.attnum), '[]'::jsonb)
    FROM t
    JOIN pg_attribute a ON a.attrelid = t.rel AND a.attnum > 0 AND NOT a.attisdropped
    LEFT JOIN pg_attrdef d ON d.adrelid = a.attrelid AND d.adnum = a.attnum),
  'constraints', (
    SELECT coalesce(jsonb_agg(jsonb_build_object(
      'name', con.conname::text,
      'type', con.contype::text,
      'definition', pg_get_constraintdef(con.oid)) ORDER BY con.conname), '[]'::jsonb)
    FROM t JOIN pg_constraint con ON con.conrelid = t.rel),
  'indexes', (
    SELECT coalesce(jsonb_agg(jsonb_build_object(
      'name', i.indexname::text,
      'definition', i.indexdef) ORDER BY i.indexname), '[]'::jsonb)
    FROM pg_indexes i
    WHERE i.schemaname = 'public' AND i.tablename = 'chat_sessions'),
  'policies', (
    SELECT coalesce(jsonb_agg(jsonb_build_object(
      'name', p.policyname::text,
      'permissive', p.permissive,
      'roles', to_jsonb(p.roles::text[]),
      'command', p.cmd,
      'using', p.qual,
      'with_check', p.with_check) ORDER BY p.policyname), '[]'::jsonb)
    FROM pg_policies p
    WHERE p.schemaname = 'public' AND p.tablename = 'chat_sessions'),
  'grants', (
    SELECT coalesce(jsonb_agg(jsonb_build_object(
      'grantee', CASE WHEN x.grantee = 0 THEN 'PUBLIC' ELSE pg_get_userbyid(x.grantee)::text END,
      'grantor', pg_get_userbyid(x.grantor)::text,
      'privilege', x.privilege_type,
      'grantable', x.is_grantable) ORDER BY x.grantee, x.privilege_type), '[]'::jsonb)
    FROM t
    JOIN pg_class c ON c.oid = t.rel
    CROSS JOIN LATERAL aclexplode(coalesce(c.relacl, acldefault('r', c.relowner))) AS x),
  'effective_privileges', (
    SELECT jsonb_object_agg(r.rolname::text, jsonb_build_object(
      'select', has_table_privilege(r.oid, t.rel, 'SELECT'),
      'insert', has_table_privilege(r.oid, t.rel, 'INSERT'),
      'update', has_table_privilege(r.oid, t.rel, 'UPDATE'),
      'delete', has_table_privilege(r.oid, t.rel, 'DELETE')))
    FROM t CROSS JOIN pg_roles r
    WHERE t.rel IS NOT NULL AND r.rolname IN ('anon', 'authenticated', 'service_role')),
  'triggers', (
    SELECT coalesce(jsonb_agg(jsonb_build_object(
      'name', tg.tgname::text,
      'enabled', tg.tgenabled::text,
      'definition', pg_get_triggerdef(tg.oid)) ORDER BY tg.tgname), '[]'::jsonb)
    FROM t JOIN pg_trigger tg ON tg.tgrelid = t.rel AND NOT tg.tgisinternal),
  'similarly_named_tables', (
    SELECT coalesce(jsonb_agg(jsonb_build_object(
      'schema', it.table_schema::text,
      'name', it.table_name::text,
      'type', it.table_type::text) ORDER BY it.table_schema::text, it.table_name::text), '[]'::jsonb)
    FROM information_schema.tables it
    WHERE it.table_name::text ILIKE '%chat%session%'),
  'adk_like_table_names_only', (
    SELECT coalesce(jsonb_agg(jsonb_build_object(
      'schema', it.table_schema::text,
      'name', it.table_name::text) ORDER BY it.table_schema::text, it.table_name::text), '[]'::jsonb)
    FROM information_schema.tables it
    WHERE it.table_name::text IN ('sessions', 'events', 'app_states', 'user_states', 'adk_internal_metadata')
      AND it.table_schema::text NOT IN ('pg_catalog', 'information_schema', 'auth', 'storage', 'realtime',
        '_realtime', 'supabase_functions', 'supabase_migrations', 'extensions', 'graphql',
        'graphql_public', 'pgsodium', 'vault', 'net', 'pgbouncer', 'cron'))
)) AS p0_chat_sessions_metadata;
