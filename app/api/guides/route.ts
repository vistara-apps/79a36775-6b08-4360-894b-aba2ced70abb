import { NextRequest } from 'next/server';
import { supabase } from '@/lib/supabase';
import {
  createApiResponse,
  createErrorResponse,
  handleApiError,
  validatePagination,
} from '@/lib/api-utils';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const { page, limit, offset } = validatePagination(searchParams);
    
    const search = searchParams.get('search') || '';
    const skillTag = searchParams.get('skill_tag') || '';
    const isPremium = searchParams.get('is_premium');
    const difficulty = searchParams.get('difficulty') || '';

    let query = supabase
      .from('skill_guides')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false });

    // Apply filters
    if (search) {
      query = query.or(`title.ilike.%${search}%,content.ilike.%${search}%,skill_tag.ilike.%${search}%`);
    }

    if (skillTag) {
      query = query.eq('skill_tag', skillTag);
    }

    if (isPremium !== null) {
      query = query.eq('is_premium', isPremium === 'true');
    }

    if (difficulty && difficulty !== 'All') {
      query = query.eq('difficulty', difficulty);
    }

    // Apply pagination
    query = query.range(offset, offset + limit - 1);

    const { data: guides, error, count } = await query;

    if (error) {
      return handleApiError(error);
    }

    return createApiResponse({
      guides,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    const requiredFields = [
      'title',
      'content',
      'skill_tag',
      'estimated_time',
      'difficulty',
    ];

    for (const field of requiredFields) {
      if (!data[field]) {
        return createErrorResponse(`Missing required field: ${field}`);
      }
    }

    // Validate difficulty
    const validDifficulties = ['Beginner', 'Intermediate', 'Advanced'];
    if (!validDifficulties.includes(data.difficulty)) {
      return createErrorResponse('Invalid difficulty level');
    }

    const { data: guide, error } = await supabase
      .from('skill_guides')
      .insert([
        {
          title: data.title,
          content: data.content,
          skill_tag: data.skill_tag,
          price: data.price || 0,
          is_premium: data.is_premium || false,
          estimated_time: data.estimated_time,
          difficulty: data.difficulty,
        },
      ])
      .select()
      .single();

    if (error) {
      return handleApiError(error);
    }

    return createApiResponse(guide, undefined, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
