import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const skillTag = searchParams.get('skillTag');
    const search = searchParams.get('search');
    const isPremium = searchParams.get('isPremium');
    const difficulty = searchParams.get('difficulty');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    let query = supabase
      .from('skill_guides')
      .select('*')
      .order('title', { ascending: true })
      .range(offset, offset + limit - 1);

    // Apply filters
    if (skillTag) {
      query = query.eq('skillTag', skillTag);
    }

    if (search) {
      query = query.or(`title.ilike.%${search}%,content.ilike.%${search}%,skillTag.ilike.%${search}%`);
    }

    if (isPremium !== null) {
      query = query.eq('isPremium', isPremium === 'true');
    }

    if (difficulty) {
      query = query.eq('difficulty', difficulty);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching guides:', error);
      return NextResponse.json({ error: 'Failed to fetch guides' }, { status: 500 });
    }

    return NextResponse.json({ guides: data });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, content, skillTag, price, isPremium, estimatedTime, difficulty } = body;

    // Validate required fields
    if (!title || !content || !skillTag || !estimatedTime || !difficulty) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('skill_guides')
      .insert([{
        title,
        content,
        skillTag,
        price: price || 0,
        isPremium: isPremium || false,
        estimatedTime,
        difficulty
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating guide:', error);
      return NextResponse.json({ error: 'Failed to create guide' }, { status: 500 });
    }

    return NextResponse.json({ guide: data }, { status: 201 });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
