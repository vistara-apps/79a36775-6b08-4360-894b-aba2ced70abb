import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Stripe integration for fiat payments
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, guideId, paymentMethod, amount } = body;

    if (!userId || !guideId || !paymentMethod || !amount) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Verify the guide exists and get its price
    const { data: guide, error: guideError } = await supabase
      .from('skill_guides')
      .select('*')
      .eq('guideId', guideId)
      .single();

    if (guideError || !guide) {
      return NextResponse.json({ error: 'Guide not found' }, { status: 404 });
    }

    if (guide.price !== amount) {
      return NextResponse.json({ error: 'Invalid payment amount' }, { status: 400 });
    }

    // Process payment based on method
    let paymentResult;
    
    if (paymentMethod === 'crypto') {
      // Handle crypto payment via Privy/Base
      paymentResult = await processCryptoPayment(userId, amount);
    } else if (paymentMethod === 'fiat') {
      // Handle fiat payment via Stripe
      paymentResult = await processFiatPayment(userId, amount);
    } else {
      return NextResponse.json({ error: 'Invalid payment method' }, { status: 400 });
    }

    if (!paymentResult.success) {
      return NextResponse.json({ error: paymentResult.error }, { status: 400 });
    }

    // Record the purchase
    const { data: purchase, error: purchaseError } = await supabase
      .from('purchases')
      .insert([{
        userId,
        guideId,
        amount,
        paymentMethod,
        transactionId: paymentResult.transactionId,
        status: 'completed',
        purchaseDate: new Date().toISOString()
      }])
      .select()
      .single();

    if (purchaseError) {
      console.error('Error recording purchase:', purchaseError);
      return NextResponse.json({ error: 'Failed to record purchase' }, { status: 500 });
    }

    // Update user's purchased content
    const { data: user } = await supabase
      .from('users')
      .select('purchasedContent')
      .eq('userId', userId)
      .single();

    if (user) {
      const updatedPurchasedContent = [...(user.purchasedContent || []), guideId];
      await supabase
        .from('users')
        .update({ purchasedContent: updatedPurchasedContent })
        .eq('userId', userId);
    }

    return NextResponse.json({ 
      success: true, 
      purchase,
      transactionId: paymentResult.transactionId 
    });

  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function processCryptoPayment(userId: string, amount: number) {
  // This would integrate with Privy for on-chain payments
  // For now, we'll simulate the payment process
  
  try {
    // In a real implementation, this would:
    // 1. Create a payment intent with Privy
    // 2. Handle the USDC transaction on Base
    // 3. Verify the transaction on-chain
    // 4. Return the transaction hash
    
    // Simulated success for development
    const transactionId = `crypto_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    return {
      success: true,
      transactionId,
      method: 'crypto'
    };
  } catch (error) {
    console.error('Crypto payment error:', error);
    return {
      success: false,
      error: 'Crypto payment failed'
    };
  }
}

async function processFiatPayment(userId: string, amount: number) {
  // This would integrate with Stripe for fiat payments
  // For now, we'll simulate the payment process
  
  try {
    // In a real implementation, this would:
    // 1. Create a payment intent with Stripe
    // 2. Process the credit card payment
    // 3. Handle webhooks for payment confirmation
    // 4. Return the Stripe payment intent ID
    
    // Simulated success for development
    const transactionId = `stripe_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    return {
      success: true,
      transactionId,
      method: 'fiat'
    };
  } catch (error) {
    console.error('Fiat payment error:', error);
    return {
      success: false,
      error: 'Fiat payment failed'
    };
  }
}

// Get payment history for a user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('purchases')
      .select(`
        *,
        skill_guides (
          title,
          skillTag,
          price
        )
      `)
      .eq('userId', userId)
      .order('purchaseDate', { ascending: false });

    if (error) {
      console.error('Error fetching payment history:', error);
      return NextResponse.json({ error: 'Failed to fetch payment history' }, { status: 500 });
    }

    return NextResponse.json({ purchases: data });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
