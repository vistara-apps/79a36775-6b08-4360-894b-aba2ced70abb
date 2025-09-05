import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { skillTag, experience, skills, projectType, userInput } = body;

    if (!skillTag || !experience || !skills) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Get relevant pitch templates
    const { data: templates } = await supabase
      .from('pitch_templates')
      .select('*')
      .eq('skillTag', skillTag)
      .limit(3);

    // Generate pitch using OpenAI (simulated for now)
    const generatedPitch = await generatePitchWithAI({
      skillTag,
      experience,
      skills,
      projectType,
      userInput,
      templates
    });

    return NextResponse.json({ 
      pitch: generatedPitch,
      templates: templates || []
    });

  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function generatePitchWithAI(params: {
  skillTag: string;
  experience: string;
  skills: string[];
  projectType?: string;
  userInput?: string;
  templates?: any[];
}) {
  const { skillTag, experience, skills, projectType, userInput, templates } = params;

  // In a real implementation, this would call OpenAI API
  // For now, we'll generate a structured pitch based on the inputs
  
  const skillsText = skills.join(', ');
  const templateContext = templates && templates.length > 0 
    ? `Based on successful ${skillTag} pitches, ` 
    : '';

  // Generate different pitch styles based on experience level
  let pitchStyle = '';
  let valueProposition = '';
  
  if (experience === 'Beginner' || experience === '0-1 years') {
    pitchStyle = 'enthusiastic and eager to learn';
    valueProposition = `I'm passionate about ${skillTag} and eager to bring fresh perspectives to your project. While I'm early in my career, I'm committed to delivering quality work and exceeding expectations.`;
  } else if (experience === 'Intermediate' || experience === '2-5 years') {
    pitchStyle = 'confident and experienced';
    valueProposition = `With solid experience in ${skillTag}, I've successfully completed similar projects and understand the nuances of delivering quality results on time and within budget.`;
  } else {
    pitchStyle = 'expert and strategic';
    valueProposition = `As an experienced ${skillTag} professional, I bring deep expertise and strategic thinking to complex projects. My track record speaks for itself.`;
  }

  const basePitch = `${templateContext}I'm a ${experience} ${skillTag} specialist with expertise in ${skillsText}. 

${valueProposition}

${projectType ? `For ${projectType} projects like yours, ` : ''}I focus on:
• Clear communication and regular updates
• Attention to detail and quality deliverables  
• Meeting deadlines and staying within scope
• Providing ongoing support when needed

${userInput ? `\nAdditionally: ${userInput}` : ''}

I'd love to discuss how I can help bring your vision to life. Let's chat about your specific needs and how we can work together to achieve your goals.

Looking forward to hearing from you!`;

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  return {
    content: basePitch,
    style: pitchStyle,
    generatedAt: new Date().toISOString(),
    wordCount: basePitch.split(' ').length
  };
}

// Get pitch templates
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const skillTag = searchParams.get('skillTag');
    const category = searchParams.get('category');

    let query = supabase.from('pitch_templates').select('*');

    if (skillTag) {
      query = query.eq('skillTag', skillTag);
    }

    if (category) {
      query = query.eq('category', category);
    }

    const { data, error } = await query.order('title', { ascending: true });

    if (error) {
      console.error('Error fetching templates:', error);
      return NextResponse.json({ error: 'Failed to fetch templates' }, { status: 500 });
    }

    return NextResponse.json({ templates: data });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
