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

CRITICAL RULES FOR NAMES:
1. Names should be creative and memorable
2. Each name MUST have a different word count (1, 2, 3, 4, and 5 words)
3. All words across all names MUST be unique (no repetition)
4. Names MUST follow maximum length: 64 characters per name
5. Names should be catchy and push boundaries of creativity
6. NO token name should contain the theme word "${context}" or any variation of it

Other rules:
7. Each token should have:
   - A memorable symbol (5-8 characters)
   - Appropriate limit and max values

8. Tokens should be:
   - Humorous
   - Trendy
   - Appealing to the crypto community

9. Ensure that (max supply / limit) results in a number between 1000 and 10000 mints:
   - Example: If limit is 100, max supply should be between 1,000 and 10,000

10. Make each token unique and distinct from the others in the list.

11. Double-check all rules, especially the name requirements, before finalizing the list.

12. Names can be clever wordplay, puns, or references to internet culture related to the theme, but without using the theme word itself.

13. Verify that NO token name includes the theme word "${context}" or any variation of it.
`,
		seed: new Date().getTime()
	})

	return result.toTextStreamResponse()
}
