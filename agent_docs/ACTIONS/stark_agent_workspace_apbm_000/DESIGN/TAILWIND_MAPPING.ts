// Design proposal only. Merge into theme.extend; preserve existing config/plugins.
// Existing canonical mappings remain. No Tailwind 4 syntax.
export const workspaceThemeExtension = {
  colors: {
    code: { DEFAULT: 'hsl(var(--code-background) / <alpha-value>)', foreground: 'hsl(var(--code-foreground) / <alpha-value>)', keyword: 'hsl(var(--code-keyword) / <alpha-value>)', string: 'hsl(var(--code-string) / <alpha-value>)' },
    sidebar: 'hsl(var(--sidebar) / <alpha-value>)',
    composer: 'hsl(var(--composer) / <alpha-value>)',
    bubble: 'hsl(var(--bubble) / <alpha-value>)',
    link: 'hsl(var(--link) / <alpha-value>)',
    overlay: 'hsl(var(--overlay) / <alpha-value>)',
    success: { DEFAULT: 'hsl(var(--success) / <alpha-value>)', foreground: 'hsl(var(--success-foreground) / <alpha-value>)' },
    warning: { DEFAULT: 'hsl(var(--warning) / <alpha-value>)', foreground: 'hsl(var(--warning-foreground) / <alpha-value>)' },
    info: { DEFAULT: 'hsl(var(--info) / <alpha-value>)', foreground: 'hsl(var(--info-foreground) / <alpha-value>)' },
  },
  borderRadius: {
    lg: 'var(--radius)', md: 'calc(var(--radius) - 2px)', sm: 'calc(var(--radius) - 4px)', composer: 'var(--radius-composer)', code: 'var(--code-radius)',
  },
};
