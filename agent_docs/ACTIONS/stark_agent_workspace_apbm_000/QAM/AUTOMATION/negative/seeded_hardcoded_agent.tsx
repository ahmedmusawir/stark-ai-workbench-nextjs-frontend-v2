// expected-red seed (never imported)
export const pick = (agent: { id: string }) => { if (agent.id === 'architect_agent') return 'special'; return 'generic'; };
