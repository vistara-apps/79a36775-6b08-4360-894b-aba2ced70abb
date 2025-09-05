import { NextRequest } from 'next/server';
import {
  createApiResponse,
  createErrorResponse,
  handleApiError,
  getCurrentUser,
} from '@/lib/api-utils';
import { generatePitch, PitchGenerationParams } from '@/lib/openai';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return createErrorResponse('Unauthorized', 401);
    }

    const data = await request.json();
    const {
      skillTag,
      experience,
      gigId,
      tone = 'professional',
    } = data;

    if (!skillTag || !experience) {
      return createErrorResponse('Missing required fields: skillTag, experience');
    }

    // Get user profile for context
    const { data: userProfile } = await supabase
      .from('users')
      .select('bio, display_name')
      .eq('id', user.id)
      .single();

    let gigTitle, gigDescription;

    // If gigId is provided, get gig details
    if (gigId) {
      const { data: gig, error: gigError } = await supabase
        .from('gigs')
        .select('title, description')
        .eq('id', gigId)
        .single();

      if (!gigError && gig) {
        gigTitle = gig.title;
        gigDescription = gig.description;
      }
    }

    const pitchParams: PitchGenerationParams = {
      skillTag,
      experience,
      gigTitle,
      gigDescription,
      userBio: userProfile?.bio,
      tone,
    };

    const generatedPitch = await generatePitch(pitchParams);

    return createApiResponse({
      pitch: generatedPitch,
      params: pitchParams,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return createErrorResponse('Unauthorized', 401);
    }

    const { searchParams } = new URL(request.url);
    const templateId = searchParams.get('templateId');

    if (!templateId) {
      return createErrorResponse('Missing templateId parameter');
    }

    // Get pitch template
    const { data: template, error } = await supabase
      .from('pitch_templates')
      .select('*')
      .eq('id', templateId)
      .single();

    if (error || !template) {
      return createErrorResponse('Template not found', 404);
    }

    return createApiResponse(template);
  } catch (error) {
    return handleApiError(error);
  }
}
