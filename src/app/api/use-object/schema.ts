import { z } from 'zod'

export const tokenSchema = z.object({
	name: z.string(),
	symbol: z.string(),
	limit: z.number(),
	max: z.number()
})

export const tokenListSchema = z.object({
	object: z.array(tokenSchema)
})
