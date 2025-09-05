import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface PitchGenerationParams {
  skillTag: string;
  experience: string;
  gigTitle?: string;
  gigDescription?: string;
  userBio?: string;
  tone?: 'professional' | 'casual' | 'enthusiastic';
}

export async function generatePitch(params: PitchGenerationParams): Promise<string> {
  try {
    const {
      skillTag,
      experience,
      gigTitle,
      gigDescription,
      userBio,
      tone = 'professional',
    } = params;

    const systemPrompt = `You are an expert freelance pitch writer. Create compelling, personalized pitches that help freelancers win gigs. The pitch should be:
- Concise (2-3 paragraphs max)
- Specific to the gig requirements
- Highlight relevant experience and skills
- Include a clear call to action
- Match the requested tone: ${tone}`;

    const userPrompt = `Create a freelance pitch for:
Skill: ${skillTag}
Experience: ${experience}
${gigTitle ? `Gig Title: ${gigTitle}` : ''}
${gigDescription ? `Gig Description: ${gigDescription}` : ''}
${userBio ? `User Bio: ${userBio}` : ''}

Make it compelling and specific to this opportunity.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    return completion.choices[0]?.message?.content || 'Unable to generate pitch';
  } catch (error) {
    console.error('Error generating pitch:', error);
    throw new Error('Failed to generate pitch');
  }
}

export async function generateEmbedding(text: string): Promise<number[]> {
  try {
    const response = await openai.embeddings.create({
      model: 'text-embedding-ada-002',
      input: text,
    });

    return response.data[0].embedding;
  } catch (error) {
    console.error('Error generating embedding:', error);
    throw new Error('Failed to generate embedding');
  }
}

export async function generateGigRecommendations(
  userSkills: string[],
  userBio?: string
): Promise<string> {
  try {
    const systemPrompt = `You are a career advisor specializing in freelance and remote work opportunities. Based on user skills and background, suggest specific types of gigs they should look for and provide actionable advice.`;

    const userPrompt = `User Skills: ${userSkills.join(', ')}
${userBio ? `User Background: ${userBio}` : ''}

Provide 3-5 specific gig recommendations and tips for finding work in these areas.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      max_tokens: 600,
      temperature: 0.7,
    });

    return completion.choices[0]?.message?.content || 'Unable to generate recommendations';
  } catch (error) {
    console.error('Error generating recommendations:', error);
    throw new Error('Failed to generate recommendations');
  }
}

export async function improveProfile(
  currentProfile: string,
  targetSkills: string[]
): Promise<string> {
  try {
    const systemPrompt = `You are a professional profile optimization expert. Help users improve their freelance profiles to attract more clients and higher-paying gigs.`;

    const userPrompt = `Current Profile: ${currentProfile}
Target Skills: ${targetSkills.join(', ')}

Provide specific suggestions to improve this profile, including:
1. Better headline/summary
2. Skills optimization
3. Portfolio recommendations
4. Pricing strategy tips`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      max_tokens: 800,
      temperature: 0.7,
    });

    return completion.choices[0]?.message?.content || 'Unable to generate profile improvements';
  } catch (error) {
    console.error('Error improving profile:', error);
    throw new Error('Failed to improve profile');
  }
}

export function estimateTokens(text: string): number {
  // Rough estimation: 1 token ≈ 4 characters
  return Math.ceil(text.length / 4);
}

export function truncateText(text: string, maxTokens: number): string {
  const maxChars = maxTokens * 4;
  if (text.length <= maxChars) {
    return text;
  }
  return text.substring(0, maxChars - 3) + '...';
}
