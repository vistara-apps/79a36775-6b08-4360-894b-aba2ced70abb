import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const farcasterId = searchParams.get('farcasterId');
    const walletAddress = searchParams.get('walletAddress');

    if (!farcasterId && !walletAddress) {
      return NextResponse.json({ error: 'Either farcasterId or walletAddress is required' }, { status: 400 });
    }

    let query = supabase.from('users').select('*');

    if (farcasterId) {
      query = query.eq('farcasterId', farcasterId);
    } else if (walletAddress) {
      query = query.eq('walletAddress', walletAddress);
    }

    const { data, error } = await query.single();

    if (error) {
      if (error.code === 'PGRST116') {
        // User not found
        return NextResponse.json({ user: null });
      }
      console.error('Error fetching user:', error);
      return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 });
    }

    return NextResponse.json({ user: data });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { farcasterId, walletAddress } = body;

    if (!farcasterId && !walletAddress) {
      return NextResponse.json({ error: 'Either farcasterId or walletAddress is required' }, { status: 400 });
    }

    // Check if user already exists
    let existingUserQuery = supabase.from('users').select('*');
    
    if (farcasterId) {
      existingUserQuery = existingUserQuery.eq('farcasterId', farcasterId);
    } else {
      existingUserQuery = existingUserQuery.eq('walletAddress', walletAddress);
    }

    const { data: existingUser } = await existingUserQuery.single();

    if (existingUser) {
      return NextResponse.json({ user: existingUser });
    }

    // Create new user
    const { data, error } = await supabase
      .from('users')
      .insert([{
        farcasterId,
        walletAddress,
        savedGigs: [],
        completedModules: [],
        purchasedContent: []
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating user:', error);
      return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
    }

    return NextResponse.json({ user: data }, { status: 201 });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, savedGigs, completedModules, purchasedContent } = body;

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    const updateData: any = {};
    if (savedGigs !== undefined) updateData.savedGigs = savedGigs;
    if (completedModules !== undefined) updateData.completedModules = completedModules;
    if (purchasedContent !== undefined) updateData.purchasedContent = purchasedContent;

    const { data, error } = await supabase
      .from('users')
      .update(updateData)
      .eq('userId', userId)
      .select()
      .single();

    if (error) {
      console.error('Error updating user:', error);
      return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
    }

    return NextResponse.json({ user: data });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
