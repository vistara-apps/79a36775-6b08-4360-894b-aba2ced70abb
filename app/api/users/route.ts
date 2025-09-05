import { NextRequest } from 'next/server';
import { supabase } from '@/lib/supabase';
import {
  createApiResponse,
  createErrorResponse,
  handleApiError,
  getCurrentUser,
} from '@/lib/api-utils';

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return createErrorResponse('Unauthorized', 401);
    }

    const { data: userData, error } = await supabase
      .from('users')
      .select(`
        *,
        saved_gigs (
          gig_id,
          gigs (*)
        ),
        purchased_content (
          guide_id,
          payment_method,
          amount_paid,
          created_at,
          skill_guides (*)
        ),
        completed_modules (
          guide_id,
          completed_at,
          skill_guides (*)
        )
      `)
      .eq('id', user.id)
      .single();

    if (error) {
      return handleApiError(error);
    }

    return createApiResponse(userData);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    const requiredFields = ['farcaster_id'];

    for (const field of requiredFields) {
      if (!data[field]) {
        return createErrorResponse(`Missing required field: ${field}`);
      }
    }

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('farcaster_id', data.farcaster_id)
      .single();

    if (existingUser) {
      return createErrorResponse('User already exists', 409);
    }

    const { data: user, error } = await supabase
      .from('users')
      .insert([
        {
          farcaster_id: data.farcaster_id,
          wallet_address: data.wallet_address,
          username: data.username,
          display_name: data.display_name,
          avatar_url: data.avatar_url,
          bio: data.bio,
          skills: data.skills || [],
        },
      ])
      .select()
      .single();

    if (error) {
      return handleApiError(error);
    }

    return createApiResponse(user, undefined, 201);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return createErrorResponse('Unauthorized', 401);
    }

    const data = await request.json();

    const { data: updatedUser, error } = await supabase
      .from('users')
      .update({
        wallet_address: data.wallet_address,
        username: data.username,
        display_name: data.display_name,
        avatar_url: data.avatar_url,
        bio: data.bio,
        skills: data.skills,
      })
      .eq('id', user.id)
      .select()
      .single();

    if (error) {
      return handleApiError(error);
    }

    return createApiResponse(updatedUser);
  } catch (error) {
    return handleApiError(error);
  }
}
