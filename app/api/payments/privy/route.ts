import { NextRequest } from 'next/server';
import {
  createApiResponse,
  createErrorResponse,
  handleApiError,
  getCurrentUser,
} from '@/lib/api-utils';
import {
  recordPayment,
  verifyPayment,
  hasUserPurchased,
  createPrivyPaymentRequest,
} from '@/lib/payments';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return createErrorResponse('Unauthorized', 401);
    }

    const data = await request.json();
    const { guideId, transactionHash } = data;

    if (!guideId || !transactionHash) {
      return createErrorResponse('Missing required fields: guideId, transactionHash');
    }

    // Check if user already purchased this guide
    const alreadyPurchased = await hasUserPurchased(user.id, guideId);
    if (alreadyPurchased) {
      return createErrorResponse('Guide already purchased', 409);
    }

    // Get guide details
    const { data: guide, error: guideError } = await supabase
      .from('skill_guides')
      .select('*')
      .eq('id', guideId)
      .single();

    if (guideError || !guide) {
      return createErrorResponse('Guide not found', 404);
    }

    if (!guide.is_premium) {
      return createErrorResponse('Guide is not premium', 400);
    }

    // Verify the transaction on-chain
    const isValidPayment = await verifyPayment(transactionHash, guide.price);
    if (!isValidPayment) {
      return createErrorResponse('Invalid payment transaction', 400);
    }

    // Record the payment
    const payment = await recordPayment({
      userId: user.id,
      guideId,
      amount: guide.price,
      paymentMethod: 'crypto',
      transactionId: transactionHash,
    });

    return createApiResponse({
      payment,
      message: 'Payment processed successfully',
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
    const guideId = searchParams.get('guideId');

    if (!guideId) {
      return createErrorResponse('Missing guideId parameter');
    }

    // Get guide details
    const { data: guide, error: guideError } = await supabase
      .from('skill_guides')
      .select('*')
      .eq('id', guideId)
      .single();

    if (guideError || !guide) {
      return createErrorResponse('Guide not found', 404);
    }

    if (!guide.is_premium) {
      return createErrorResponse('Guide is not premium', 400);
    }

    // Create payment request
    const paymentRequest = createPrivyPaymentRequest(
      guide.price,
      process.env.GIGFLOW_WALLET_ADDRESS || '0x...' // Platform wallet address
    );

    return createApiResponse({
      paymentRequest,
      guide: {
        id: guide.id,
        title: guide.title,
        price: guide.price,
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}
