import { z } from 'zod'

export const userSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  password: z.string(),
  phone: z.number(),
  email: z.string(),
})
