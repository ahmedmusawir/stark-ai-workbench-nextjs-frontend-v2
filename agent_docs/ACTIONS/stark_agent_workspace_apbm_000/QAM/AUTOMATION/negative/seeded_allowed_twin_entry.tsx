// expected-green twin of seeded_forbidden_entry.tsx: same shape, allowed import; proves the harness pipeline itself builds.
import { workspaceAgentsForUi } from '@/config/manifest';
console.log(workspaceAgentsForUi);
