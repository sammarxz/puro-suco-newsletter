import {
  Html,
  Head,
  Font,
  Preview,
  Body,
  Container,
  Section,
  Img,
  Text,
  Link,
  Button,
  Hr,
  Column,
  Row,
} from '@react-email/components'

interface ConfirmationEmailProps {
  email: string
  confirmationUrl: string
}

export default function ConfirmationEmail({ email, confirmationUrl }: ConfirmationEmailProps) {
  return (
    <Html>
      <Head>
        <Font
          fontFamily="Inter"
          fallbackFontFamily="Helvetica"
          webFont={{
            url: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap',
            format: 'woff2',
          }}
          fontWeight={400}
          fontStyle="normal"
        />
      </Head>
      <Preview>Confirme sua inscrição na newsletter Puro Suco</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Img
              src="https://purosuco.dev/logo.svg"
              width="48"
              height="48"
              alt="Puro Suco"
              style={logo}
            />
            <Text style={brandName}>Puro Suco</Text>
          </Section>

          {/* Main Content */}
          <Section style={content}>
            <Text style={heading}>Quase lá! 🍊</Text>

            <Text style={paragraph}>
              Olá! Você solicitou a inscrição na newsletter <strong>Puro Suco</strong>
              com o email <strong>{email}</strong>.
            </Text>

            <Text style={paragraph}>
              Para confirmar sua inscrição e começar a receber nosso conteúdo semanal sobre tech,
              desenvolvimento e design, clique no botão abaixo:
            </Text>

            <Section style={buttonContainer}>
              <Button href={confirmationUrl} style={button}>
                Confirmar Inscrição
              </Button>
            </Section>

            <Text style={smallText}>Ou copie e cole este link no seu navegador:</Text>
            <Link href={confirmationUrl} style={link}>
              {confirmationUrl}
            </Link>

            <Hr style={hr} />

            <Text style={paragraph}>
              Após a confirmação, você receberá um email de boas-vindas e passará a receber nossas
              newsletters semanais com:
            </Text>

            <Text style={listItem}>• As melhores notícias de tecnologia</Text>
            <Text style={listItem}>• Dicas de desenvolvimento e design</Text>
            <Text style={listItem}>• Ferramentas e recursos úteis</Text>
            <Text style={listItem}>• Insights e reflexões do Sam</Text>

            <Text style={smallText}>
              <strong>Importante:</strong> Este link expira em 24 horas. Se não conseguir confirmar
              a tempo, será necessário se inscrever novamente.
            </Text>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              Esta é uma mensagem automática de confirmação.
              <br />
              Se você não se inscreveu, pode ignorar este email.
            </Text>

            <Hr style={footerHr} />

            <Row>
              <Column>
                <Text style={footerInfo}>
                  <strong>Puro Suco Newsletter</strong>
                  <br />
                  Criado por{' '}
                  <Link href="https://marxz.me" style={footerLink}>
                    Sam Marxz
                  </Link>
                </Text>
              </Column>
            </Row>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

// Styles
const main = {
  backgroundColor: '#ffffff',
  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif',
}

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  maxWidth: '580px',
}

const header = {
  textAlign: 'center' as const,
  padding: '32px 0',
}

const logo = {
  margin: '0 auto',
}

const brandName = {
  fontSize: '24px',
  fontWeight: '600',
  color: '#111111',
  margin: '16px 0 0 0',
}

const content = {
  padding: '0 24px',
}

const heading = {
  fontSize: '28px',
  fontWeight: '600',
  color: '#111111',
  textAlign: 'center' as const,
  margin: '0 0 32px 0',
}

const paragraph = {
  fontSize: '16px',
  lineHeight: '24px',
  color: '#374151',
  margin: '16px 0',
}

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '32px 0',
}

const button = {
  backgroundColor: '#f97316',
  borderRadius: '8px',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: '500',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '12px 32px',
  border: 'none',
}

const link = {
  color: '#f97316',
  fontSize: '14px',
  textDecoration: 'underline',
  wordBreak: 'break-all' as const,
}

const listItem = {
  fontSize: '15px',
  lineHeight: '22px',
  color: '#374151',
  margin: '8px 0',
  paddingLeft: '8px',
}

const smallText = {
  fontSize: '14px',
  lineHeight: '20px',
  color: '#6b7280',
  margin: '16px 0',
}

const hr = {
  borderColor: '#e5e7eb',
  margin: '32px 0',
}

const footer = {
  padding: '32px 24px 0',
}

const footerText = {
  fontSize: '12px',
  lineHeight: '18px',
  color: '#9ca3af',
  textAlign: 'center' as const,
  margin: '0 0 16px 0',
}

const footerHr = {
  borderColor: '#e5e7eb',
  margin: '16px 0',
}

const footerInfo = {
  fontSize: '12px',
  lineHeight: '18px',
  color: '#9ca3af',
  textAlign: 'center' as const,
  margin: '0',
}

const footerLink = {
  color: '#f97316',
  textDecoration: 'none',
}
