import { supabase } from './supabase';

export interface PaymentData {
  userId: string;
  guideId: string;
  amount: number;
  paymentMethod: 'crypto' | 'fiat';
  transactionId?: string;
}

export async function recordPayment(paymentData: PaymentData) {
  try {
    const { data: payment, error } = await supabase
      .from('purchased_content')
      .insert([
        {
          user_id: paymentData.userId,
          guide_id: paymentData.guideId,
          payment_method: paymentData.paymentMethod,
          amount_paid: paymentData.amount,
          transaction_id: paymentData.transactionId,
        },
      ])
      .select()
      .single();

    if (error) {
      throw error;
    }

    return payment;
  } catch (error) {
    console.error('Error recording payment:', error);
    throw error;
  }
}

export async function verifyPayment(transactionId: string, expectedAmount: number) {
  try {
    // This would typically verify the payment with the payment provider
    // For now, we'll return true as a placeholder
    // In production, implement proper payment verification
    return true;
  } catch (error) {
    console.error('Error verifying payment:', error);
    return false;
  }
}

export async function getUserPurchases(userId: string) {
  try {
    const { data: purchases, error } = await supabase
      .from('purchased_content')
      .select(`
        *,
        skill_guides (*)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return purchases;
  } catch (error) {
    console.error('Error fetching user purchases:', error);
    throw error;
  }
}

export async function hasUserPurchased(userId: string, guideId: string): Promise<boolean> {
  try {
    const { data: purchase, error } = await supabase
      .from('purchased_content')
      .select('id')
      .eq('user_id', userId)
      .eq('guide_id', guideId)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    return !!purchase;
  } catch (error) {
    console.error('Error checking user purchase:', error);
    return false;
  }
}

export function calculatePlatformFee(amount: number): number {
  // 5% platform fee
  return Math.round(amount * 0.05 * 100) / 100;
}

export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
}

// Stripe helpers
export function createStripePaymentIntent(amount: number, currency: string = 'usd') {
  // This would create a Stripe payment intent
  // Implementation depends on Stripe SDK
  return {
    client_secret: 'pi_test_client_secret',
    amount,
    currency,
  };
}

// Privy helpers
export function createPrivyPaymentRequest(amount: number, recipient: string) {
  // This would create a Privy payment request
  // Implementation depends on Privy SDK
  return {
    amount,
    recipient,
    currency: 'USDC',
    network: 'base',
  };
}
