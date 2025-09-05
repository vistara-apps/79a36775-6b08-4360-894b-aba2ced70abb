import { NextRequest } from 'next/server';
import { supabase } from '@/lib/supabase';
import {
  createApiResponse,
  createErrorResponse,
  handleApiError,
  validatePagination,
  buildSearchQuery,
} from '@/lib/api-utils';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const { page, limit, offset } = validatePagination(searchParams);
    const { search, category, skills, vetted } = buildSearchQuery(searchParams);

    let query = supabase
      .from('gigs')
      .select('*', { count: 'exact' })
      .order('posted_date', { ascending: false });

    // Apply filters
    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
    }

    if (category && category !== 'All') {
      query = query.eq('category', category);
    }

    if (vetted) {
      query = query.eq('vetted', true);
    }

    if (skills.length > 0) {
      query = query.overlaps('skills', skills);
    }

    // Apply pagination
    query = query.range(offset, offset + limit - 1);

    const { data: gigs, error, count } = await query;

    if (error) {
      return handleApiError(error);
    }

    return createApiResponse({
      gigs,
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
      'description',
      'url',
      'source',
      'category',
      'pay_rate',
      'posted_date',
      'skills',
    ];

    for (const field of requiredFields) {
      if (!data[field]) {
        return createErrorResponse(`Missing required field: ${field}`);
      }
    }

    const { data: gig, error } = await supabase
      .from('gigs')
      .insert([
        {
          title: data.title,
          description: data.description,
          url: data.url,
          source: data.source,
          category: data.category,
          pay_rate: data.pay_rate,
          posted_date: data.posted_date,
          skills: data.skills,
          vetted: data.vetted || false,
        },
      ])
      .select()
      .single();

    if (error) {
      return handleApiError(error);
    }

    return createApiResponse(gig, undefined, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
