import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const skills = searchParams.get('skills')?.split(',') || [];
    const search = searchParams.get('search');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    let query = supabase
      .from('gigs')
      .select('*')
      .eq('vetted', true)
      .order('postedDate', { ascending: false })
      .range(offset, offset + limit - 1);

    // Apply filters
    if (category && category !== 'All') {
      query = query.eq('category', category);
    }

    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
    }

    if (skills.length > 0) {
      query = query.overlaps('skills', skills);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching gigs:', error);
      return NextResponse.json({ error: 'Failed to fetch gigs' }, { status: 500 });
    }

    return NextResponse.json({ gigs: data });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, url, source, category, payRate, skills } = body;

    // Validate required fields
    if (!title || !description || !url || !source || !category || !payRate) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('gigs')
      .insert([{
        title,
        description,
        url,
        source,
        category,
        payRate,
        skills: skills || [],
        vetted: false, // New gigs need to be vetted
        postedDate: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating gig:', error);
      return NextResponse.json({ error: 'Failed to create gig' }, { status: 500 });
    }

    return NextResponse.json({ gig: data }, { status: 201 });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
