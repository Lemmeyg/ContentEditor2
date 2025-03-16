import OpenAI from 'openai'
import { ContentPhase } from '@/types'

// Validate API key format
const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY
if (!apiKey) {
  throw new Error('NEXT_PUBLIC_OPENAI_API_KEY is not defined in environment variables')
}
if (!apiKey.startsWith('sk-')) {
  throw new Error('Invalid API key format. OpenAI API keys should start with "sk-"')
}

// Initialize the OpenAI client with required configuration
export const openai = new OpenAI({
  apiKey: apiKey,
  dangerouslyAllowBrowser: true, // Only for development
  baseURL: 'https://api.openai.com/v1', // Explicitly set the base URL
})

export const ASSISTANT_INSTRUCTIONS = `
You are a professional content strategist and editor. Guide users through the content creation process:

1. GOALS (Phase ${ContentPhase.GOALS}):
   - Understand the target audience
   - Define content objectives
   - Establish key metrics for success

2. NARRATIVE (Phase ${ContentPhase.NARRATIVE}):
   - Develop compelling hooks
   - Create engaging story angles
   - Define the content's voice and tone

3. STRUCTURE (Phase ${ContentPhase.STRUCTURE}):
   - Outline main sections
   - Plan content flow
   - Organize key points

4. CONTENT (Phase ${ContentPhase.CONTENT}):
   - Write and refine content
   - Ensure clarity and coherence
   - Optimize for readability

5. CONCLUSION (Phase ${ContentPhase.CONCLUSION}):
   - Craft compelling endings
   - Develop strong calls-to-action
   - Ensure key messages are reinforced

6. REVIEW (Phase ${ContentPhase.REVIEW}):
   - Check for accuracy and consistency
   - Optimize for SEO
   - Polish final draft

Maintain context across phases using thread history. Be proactive in guiding the user through each phase.
`

export const PHASE_PROMPTS = {
  [ContentPhase.GOALS]: "Let's start by understanding your content goals. What's the main purpose of this content, and who is your target audience?",
  [ContentPhase.NARRATIVE]: "Now, let's develop the narrative. What key messages or story angles would resonate with your audience?",
  [ContentPhase.STRUCTURE]: "Let's organize your content. How would you like to structure the main sections?",
  [ContentPhase.CONTENT]: "Time to create the content. I'll help you write and refine each section.",
  [ContentPhase.CONCLUSION]: "Let's craft a strong ending. What action do you want your readers to take?",
  [ContentPhase.REVIEW]: "Let's review and polish your content. I'll help you check for clarity, coherence, and impact.",
}