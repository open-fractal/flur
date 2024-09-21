import { createOpenAI } from '@ai-sdk/openai'
import { streamObject } from 'ai'
import { tokenListSchema } from './schema'

// Allow streaming responses up to 30 seconds
export const maxDuration = 30

const groq = createOpenAI({
	baseURL: 'https://api.groq.com/openai/v1',
	apiKey: process.env.GROQ_API_KEY
})

const model = groq('llama3-groq-70b-8192-tool-use-preview')

export async function POST(req: Request) {
	const context = await req.json()

	const result = await streamObject({
		model,
		schema: tokenListSchema,
		prompt: `Create a list of 5 unique and creative meme coin tokens based on the theme: "${context}".

Rules:
1. Each token should have:
   - A catchy name (1-5 words, spaces allowed)
   - A memorable symbol (5-8 characters)
   - Appropriate limit and max values
   - Different name word count from others in the list (use 1, 2, 3, 4, and 5 words)
   - Ensure all words in names are unique across the entire list of tokens
   - Names shoudl be no longer than 32 characters

2. Tokens should be:
   - Humorous
   - Trendy
   - Phrases

4. Ensure that (max supply / limit) results in a number between 1000 and 10000 mints:
   - Example: If limit is 100, max supply should be between 100,000 and 1,000,000
   - This creates a reasonable number of minting opportunities for each token

5. Make each token unique and distinct from the others in the list.

6. Double-check that no words are repeated across any of the token names.
`,
		seed: new Date().getTime()
	})

	return result.toTextStreamResponse()
}
