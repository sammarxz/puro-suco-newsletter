import '../.astro/types.d.ts'
import 'astro/client'

interface ImportMetaEnv {
  readonly RESEND_API_KEY: string
  readonly PUBLIC_SITE_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
