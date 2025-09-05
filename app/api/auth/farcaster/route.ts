import { NextRequest } from 'next/server';
import {
  createApiResponse,
  createErrorResponse,
  handleApiError,
} from '@/lib/api-utils';
import {
  verifyFarcasterUser,
  createOrUpdateUser,
  createUserSession,
  generateNonce,
  verifySignature,
} from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { fid, signature, message, walletAddress } = data;

    if (!fid) {
      return createErrorResponse('Missing Farcaster ID');
    }

    // Verify the Farcaster user exists
    const farcasterUser = await verifyFarcasterUser(fid);
    if (!farcasterUser) {
      return createErrorResponse('Invalid Farcaster user');
    }

    // If signature and message are provided, verify the wallet signature
    if (signature && message && walletAddress) {
      const isValidSignature = verifySignature(message, signature, walletAddress);
      if (!isValidSignature) {
        return createErrorResponse('Invalid wallet signature');
      }
    }

    // Create or update user in database
    const user = await createOrUpdateUser(farcasterUser, walletAddress);

    // Create user session
    const session = await createUserSession(user.id);

    return createApiResponse({
      user,
      session: session.session,
      access_token: session.session?.access_token,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    if (action === 'nonce') {
      const nonce = generateNonce();
      return createApiResponse({ nonce });
    }

    return createErrorResponse('Invalid action');
  } catch (error) {
    return handleApiError(error);
  }
}
