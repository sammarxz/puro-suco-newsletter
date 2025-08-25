import {
  Html,
  Head,
  Font,
  Preview,
  Body,
  Container,
  Section,
  Text,
  Link,
  Hr,
  Heading,
  Button,
} from '@react-email/components'

interface WelcomeEmailProps {
  email: string
  unsubscribeUrl: string
}

export default function WelcomeEmail({ email, unsubscribeUrl }: WelcomeEmailProps) {
  return (
    <Html>
      <Head>
        <Font
          fontFamily="Inter"
          fallbackFontFamily="Arial"
          webFont={{
            url: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2',
            format: 'woff2',
          }}
          fontWeight={400}
          fontStyle="normal"
        />
        <Font
          fontFamily="Crimson Text"
          fallbackFontFamily="Georgia"
          webFont={{
            url: 'https://fonts.gstatic.com/s/crimsontext/v19/wlp2gwHKFkZgtmSR3NB0oRJX8A.woff2',
            format: 'woff2',
          }}
          fontWeight={600}
          fontStyle="normal"
        />
      </Head>
      <Preview>Bem-vindo ao Puro Suco Newsletter! 🍊</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Heading style={logo}>🍊 Puro Suco</Heading>
          </Section>

          <Hr style={hr} />

          <Section style={content}>
            <Heading style={titleStyle}>Bem-vindo ao Puro Suco! 🎉</Heading>

            <Text style={paragraph}>
              Olá! Obrigado por se inscrever na nossa newsletter semanal.
            </Text>

            <Text style={paragraph}>
              Toda semana você receberá em <strong>{email}</strong> uma curadoria especial com:
            </Text>

            <ul style={list}>
              <li style={listItem}>📈 Principais tendências em desenvolvimento web</li>
              <li style={listItem}>🔧 Ferramentas e bibliotecas em destaque</li>
              <li style={listItem}>🎨 Novidades em design e UX</li>
              <li style={listItem}>📚 Artigos e recursos recomendados</li>
            </ul>

            <Text style={paragraph}>
              Nossa primeira edição chegará na próxima semana. Mal podemos esperar para compartilhar
              conteúdo de qualidade com você!
            </Text>

            <Button href="https://purosuco.dev" style={button}>
              Conheça nosso arquivo
            </Button>
          </Section>

          <Hr style={hr} />

          <Section style={footer}>
            <Text style={footerText}>
              Newsletter semanal com as melhores notícias de tech, desenvolvimento e design.
            </Text>
            <Text style={footerText}>
              <Link href={unsubscribeUrl} style={unsubscribeLink}>
                Cancelar inscrição
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

const main = {
  backgroundColor: '#ffffff',
  fontFamily: 'Inter, Arial, sans-serif',
}

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  maxWidth: '600px',
}

const header = {
  textAlign: 'center' as const,
  marginBottom: '32px',
}

const logo = {
  fontFamily: 'Crimson Text, Georgia, serif',
  fontSize: '32px',
  fontWeight: '600',
  color: '#000000',
  margin: '0',
}

const hr = {
  borderColor: '#e5e5e5',
  margin: '32px 0',
}

const content = {
  padding: '0 20px',
}

const titleStyle = {
  fontFamily: 'Crimson Text, Georgia, serif',
  fontSize: '28px',
  fontWeight: '600',
  color: '#000000',
  lineHeight: '1.2',
  margin: '0 0 24px 0',
}

const paragraph = {
  fontSize: '16px',
  lineHeight: '1.6',
  color: '#000000',
  margin: '0 0 16px 0',
}

const list = {
  margin: '0 0 24px 0',
  paddingLeft: '0',
}

const listItem = {
  fontSize: '16px',
  lineHeight: '1.6',
  color: '#000000',
  margin: '0 0 8px 0',
  listStyleType: 'none',
}

const button = {
  backgroundColor: '#000000',
  borderRadius: '8px',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: '600',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  padding: '12px 24px',
  margin: '32px 0',
}

const footer = {
  textAlign: 'center' as const,
  padding: '0 20px',
}

const footerText = {
  fontSize: '14px',
  color: '#737373',
  lineHeight: '1.6',
  margin: '0 0 16px 0',
}

const unsubscribeLink = {
  color: '#737373',
  textDecoration: 'underline',
}
