// Design tokens para manter consistência visual com o site
export const designTokens = {
  fonts: {
    serif: 'Source Serif 4, Georgia, serif',
    sans: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif',
    mono: 'Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
  },
  colors: {
    primary: '#f59e0b', // amber-500
    primaryHover: '#d97706', // amber-600
    text: {
      primary: '#111827', // gray-900
      secondary: '#374151', // gray-700
      muted: '#6b7280', // gray-500
      light: '#9ca3af', // gray-400
    },
    background: {
      primary: '#ffffff',
      muted: '#f9fafb', // gray-50
      highlight: '#fefce8', // amber-50
      code: '#f3f4f6', // gray-100
    },
    border: {
      primary: '#e5e7eb', // gray-200
      light: '#f3f4f6', // gray-100
      accent: '#f59e0b', // amber-500 para blockquotes
    },
  },
  spacing: {
    xs: '8px',
    sm: '12px',
    md: '16px',
    lg: '20px',
    xl: '24px',
    '2xl': '32px',
    '3xl': '40px',
  },
  borderRadius: {
    sm: '4px',
    md: '6px',
    lg: '8px',
  },
  typography: {
    sizes: {
      xs: '12px',
      sm: '14px',
      base: '16px',
      lg: '18px',
      xl: '20px',
      '2xl': '24px',
      '3xl': '30px',
      '4xl': '36px',
    },
    lineHeights: {
      tight: '1.25',
      snug: '1.3',
      normal: '1.5',
      relaxed: '1.6',
    },
    fontWeights: {
      normal: '400',
      medium: '500',
      semibold: '600',
    },
  },
}

// Estilos CSS reutilizáveis
export const emailStyles = {
  main: {
    backgroundColor: designTokens.colors.background.primary,
    fontFamily: designTokens.fonts.sans,
  },
  container: {
    margin: '0 auto',
    padding: designTokens.spacing.lg,
    maxWidth: '600px',
  },
  heading: {
    fontFamily: designTokens.fonts.serif,
    fontSize: designTokens.typography.sizes['4xl'],
    fontWeight: designTokens.typography.fontWeights.normal,
    color: designTokens.colors.text.primary,
    margin: `0 0 ${designTokens.spacing.xl} 0`,
    lineHeight: designTokens.typography.lineHeights.tight,
  },
  subheading: {
    fontFamily: designTokens.fonts.serif,
    fontSize: designTokens.typography.sizes['3xl'],
    fontWeight: designTokens.typography.fontWeights.normal,
    color: designTokens.colors.text.primary,
    margin: `${designTokens.spacing['2xl']} 0 ${designTokens.spacing.md} 0`,
    lineHeight: designTokens.typography.lineHeights.snug,
  },
  paragraph: {
    fontFamily: designTokens.fonts.sans,
    fontSize: designTokens.typography.sizes.base,
    lineHeight: designTokens.typography.lineHeights.relaxed,
    color: designTokens.colors.text.secondary,
    margin: `0 0 ${designTokens.spacing.lg} 0`,
  },
  button: {
    backgroundColor: designTokens.colors.primary,
    borderRadius: designTokens.borderRadius.lg,
    color: designTokens.colors.background.primary,
    fontSize: designTokens.typography.sizes.base,
    fontWeight: designTokens.typography.fontWeights.medium,
    fontFamily: `${designTokens.fonts.sans}`,
    textDecoration: 'none',
    textAlign: 'center' as const,
    display: 'inline-block',
    padding: `${designTokens.spacing.sm} ${designTokens.spacing.xl}`,
    border: 'none',
  },
  buttonText: {
    color: designTokens.colors.background.primary,
    fontSize: designTokens.typography.sizes.base,
    fontWeight: designTokens.typography.fontWeights.semibold,
    fontFamily: `${designTokens.fonts.sans}`,
    margin: 0,
    padding: 0,
  },
  badge: {
    backgroundColor: designTokens.colors.background.highlight,
    border: `1px solid ${designTokens.colors.border.accent}`,
    width: 'fit-content' as const,
    display: 'inline-block' as const,
    padding: `0px ${designTokens.spacing.sm}`,
    borderRadius: designTokens.borderRadius.lg,
    fontFamily: designTokens.fonts.sans,
    fontSize: designTokens.typography.sizes.xs,
    textTransform: 'uppercase' as const,
    letterSpacing: '1px',
    color: designTokens.colors.primaryHover,
    fontWeight: designTokens.typography.fontWeights.semibold,
    margin: 0,
  },
  link: {
    color: designTokens.colors.primary,
    textDecoration: 'underline',
  },
  hr: {
    borderColor: designTokens.colors.border.primary,
    margin: `${designTokens.spacing['2xl']} 0`,
  },
  footer: {
    padding: `${designTokens.spacing['2xl']} 0 0 0`,
  },
  footerText: {
    fontFamily: designTokens.fonts.sans,
    fontSize: designTokens.typography.sizes.xs,
    lineHeight: designTokens.typography.lineHeights.normal,
    color: designTokens.colors.text.light,
    margin: `0 0 ${designTokens.spacing.sm} 0`,
  },
  // Estilos adicionais para elementos markdown
  list: {
    fontFamily: designTokens.fonts.sans,
    fontSize: designTokens.typography.sizes.base,
    lineHeight: designTokens.typography.lineHeights.relaxed,
    color: designTokens.colors.text.secondary,
    margin: `0 0 ${designTokens.spacing.lg} 0`,
    paddingLeft: designTokens.spacing.lg,
  },
  listItem: {
    margin: `0 0 ${designTokens.spacing.xs} 0`,
  },
  code: {
    fontFamily: designTokens.fonts.mono,
    fontSize: designTokens.typography.sizes.sm,
    backgroundColor: designTokens.colors.background.code,
    color: designTokens.colors.text.primary,
    padding: `2px ${designTokens.spacing.xs}`,
    borderRadius: designTokens.borderRadius.sm,
  },
  blockquote: {
    fontFamily: designTokens.fonts.sans,
    fontSize: designTokens.typography.sizes.base,
    lineHeight: designTokens.typography.lineHeights.relaxed,
    color: designTokens.colors.text.secondary,
    backgroundColor: designTokens.colors.background.highlight,
    borderLeft: `4px solid ${designTokens.colors.border.accent}`,
    margin: `${designTokens.spacing.xl} 0`,
    padding: `${designTokens.spacing.md} ${designTokens.spacing.xl}`,
    fontStyle: 'italic',
  },
}
