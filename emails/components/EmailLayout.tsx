import React from 'react'
import { Html, Head, Font, Preview, Body, Container, Tailwind } from '@react-email/components'
import { emailStyles } from '../styles/design-tokens'

interface EmailLayoutProps {
  preview: string
  children: React.ReactNode
}

export default function EmailLayout({ preview, children }: EmailLayoutProps) {
  return (
    <Html>
      <Head>
        <Font
          fontFamily="Inter"
          fallbackFontFamily="Arial"
          webFont={{
            url: 'https://fonts.gstatic.com/s/inter/v19/UcC73FwrK3iLTeHuS_nVMrMxCp50SjIa1pL7W0I5nvwUgHU.woff2',
            format: 'woff2',
          }}
          fontWeight={400}
          fontStyle="normal"
        />
        <Font
          fontFamily="Source Serif 4"
          fallbackFontFamily="Georgia"
          webFont={{
            url: 'https://fonts.gstatic.com/s/sourceserif4/v13/vEFI2_tTDB4M7-auWDN0ahZJW1gb8tc.woff2',
            format: 'woff2',
          }}
          fontWeight={400}
          fontStyle="normal"
        />
      </Head>
      <Preview>{preview}</Preview>
      <Tailwind
        config={{
          theme: {
            extend: {
              colors: {
                primary: '#f59e0b',
                'primary-hover': '#f59e0b',
                'text-primary': '#111827',
                'text-secondary': '#374151',
                'text-muted': '#6b7280',
                'text-light': '#9ca3af',
                'bg-muted': '#f9fafb',
                'bg-highlight': '#fefce8',
                'border-primary': '#e5e7eb',
                'border-light': '#f3f4f6',
              },
              fontFamily: {
                serif: ['Source Serif 4', 'Georgia', 'serif'],
                sans: [
                  'Inter',
                  '-apple-system',
                  'BlinkMacSystemFont',
                  'Segoe UI',
                  'Arial',
                  'sans-serif',
                ],
              },
            },
          },
        }}
      >
        <Body style={emailStyles.main}>
          <Container style={emailStyles.container}>{children}</Container>
        </Body>
      </Tailwind>
    </Html>
  )
}
