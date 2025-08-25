import { z } from 'zod'

export const subscriptionSchema = z.object({
  email: z
    .string()
    .min(1, 'Email é obrigatório')
    .email('Email inválido')
    .max(255, 'Email muito longo'),
})

export const unsubscribeSchema = z.object({
  token: z.string().min(1, 'Token é obrigatório'),
})

export type SubscriptionInput = z.infer<typeof subscriptionSchema>
export type UnsubscribeInput = z.infer<typeof unsubscribeSchema>
