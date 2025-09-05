import { supabase } from './supabase';

export interface FarcasterUser {
  fid: number;
  username: string;
  display_name: string;
  pfp_url: string;
  bio?: string;
  verified_addresses?: {
    eth_addresses: string[];
  };
}

export async function verifyFarcasterUser(fid: number): Promise<FarcasterUser | null> {
  try {
    const response = await fetch(`https://api.neynar.com/v2/farcaster/user/bulk?fids=${fid}`, {
      headers: {
        'api_key': process.env.NEYNAR_API_KEY!,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user from Neynar');
    }

    const data = await response.json();
    const user = data.users?.[0];

    if (!user) {
      return null;
    }

    return {
      fid: user.fid,
      username: user.username,
      display_name: user.display_name,
      pfp_url: user.pfp_url,
      bio: user.profile?.bio?.text,
      verified_addresses: user.verified_addresses,
    };
  } catch (error) {
    console.error('Error verifying Farcaster user:', error);
    return null;
  }
}

export async function createOrUpdateUser(farcasterUser: FarcasterUser, walletAddress?: string) {
  try {
    // Check if user exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('*')
      .eq('farcaster_id', farcasterUser.fid.toString())
      .single();

    const userData = {
      farcaster_id: farcasterUser.fid.toString(),
      username: farcasterUser.username,
      display_name: farcasterUser.display_name,
      avatar_url: farcasterUser.pfp_url,
      bio: farcasterUser.bio,
      wallet_address: walletAddress || farcasterUser.verified_addresses?.eth_addresses?.[0],
    };

    if (existingUser) {
      // Update existing user
      const { data: updatedUser, error } = await supabase
        .from('users')
        .update(userData)
        .eq('id', existingUser.id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return updatedUser;
    } else {
      // Create new user
      const { data: newUser, error } = await supabase
        .from('users')
        .insert([userData])
        .select()
        .single();

      if (error) {
        throw error;
      }

      return newUser;
    }
  } catch (error) {
    console.error('Error creating/updating user:', error);
    throw error;
  }
}

export async function createUserSession(userId: string) {
  try {
    // Create a custom JWT token for the user
    const { data, error } = await supabase.auth.admin.generateLink({
      type: 'magiclink',
      email: `${userId}@gigflow.local`, // Temporary email for session
      options: {
        data: {
          user_id: userId,
        },
      },
    });

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error creating user session:', error);
    throw error;
  }
}

export function generateNonce(): string {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
}

export function verifySignature(
  message: string,
  signature: string,
  address: string
): boolean {
  // This would typically use a library like ethers.js to verify the signature
  // For now, we'll return true as a placeholder
  // In production, implement proper signature verification
  return true;
}
