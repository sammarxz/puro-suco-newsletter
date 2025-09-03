import NewsletterTemplate from './newsletter-template'
import { getSiteUrl, createUnsubscribeUrl } from '../utils/env'

// Conteúdo real da primeira newsletter para preview
const newsletter001Content = `
Olá, desenvolvedores e designers!

Esta é a primeira edição da nossa newsletter semanal, onde vamos explorar as principais notícias, ferramentas e tendências do mundo tech.

## 📈 Tendências em Destaque

### 1. **Astro 4.0 - O Futuro dos Sites Estáticos**

O Astro continua revolucionando como construímos sites performáticos. Com sua abordagem "islands architecture", está se tornando a escolha favorita para projetos que precisam de performance sem abrir mão da interatividade.

**Por que importa:** Zero JavaScript por padrão, hidratação seletiva e suporte nativo para múltiplos frameworks.

### 2. **TypeScript Strict Mode - A Nova Realidade**

Mais projetos estão adotando o modo estrito do TypeScript desde o início. A tipagem rigorosa está se tornando padrão para equipes que valorizam qualidade de código.

**Dica:** Configure \`"strict": true\` em novos projetos. Seu futuro eu agradece.

### 3. **Design Systems Minimalistas**

O movimento minimalista no design está ganhando força, com foco em tipografia elegante, espaçamentos consistentes e paletas reduzidas.

## 🔧 Ferramentas da Semana

- **Resend**: API moderna para envio de emails
- **Tailwind CSS**: Utility-first para styling rápido
- **React Email**: Templates de email com componentes React

## 📚 Leituras Recomendadas

1. [The Architecture of Open Source Applications](http://aosabook.org/en/index.html)
2. [Patterns.dev - Modern Web App Design Patterns](https://patterns.dev/)

> **Dica especial:** Esta newsletter é 100% open-source! Você pode conferir todo o código no nosso repositório e até contribuir com melhorias.

---

**Gostou desta edição?** Compartilhe com sua equipe e nos siga para mais conteúdo de qualidade!

_Até a próxima semana! 🍊_`

export default function NewsletterTemplatePreview() {
  return (
    <NewsletterTemplate
      title="Primeira Edição - O Futuro do Desenvolvimento Web"
      content={newsletter001Content}
      previewText="Nesta primeira edição, exploramos as tendências que estão moldando o desenvolvimento web em 2025."
      issue={1}
      unsubscribeUrl={createUnsubscribeUrl('mock-token-123')}
      baseUrl={getSiteUrl()}
    />
  )
}
