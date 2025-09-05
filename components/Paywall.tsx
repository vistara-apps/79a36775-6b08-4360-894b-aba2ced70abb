'use client';

import { useState } from 'react';
import { Lock, CreditCard, Wallet } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface PaywallProps {
  title: string;
  price: number;
  description: string;
  onPurchase: (method: 'crypto' | 'fiat') => void;
  isLoading?: boolean;
}

export function Paywall({ title, price, description, onPurchase, isLoading = false }: PaywallProps) {
  const [selectedMethod, setSelectedMethod] = useState<'crypto' | 'fiat'>('crypto');

  const handlePurchase = () => {
    onPurchase(selectedMethod);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="glass-card max-w-md w-full p-6 animate-slide-up">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">{title}</h2>
          <p className="text-sm text-gray-600 mb-4">{description}</p>
          <div className="text-3xl font-bold text-gray-900">
            {formatCurrency(price)}
          </div>
        </div>

        <div className="space-y-4 mb-6">
          <div className="text-sm font-medium text-gray-700 mb-2">
            Choose payment method:
          </div>
          
          <div className="space-y-2">
            <button
              onClick={() => setSelectedMethod('crypto')}
              className={`w-full p-3 rounded-lg border-2 transition-all duration-200 flex items-center space-x-3 ${
                selectedMethod === 'crypto'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <Wallet className="w-5 h-5 text-blue-600" />
              <div className="text-left">
                <div className="font-medium text-gray-900">Pay with USDC</div>
                <div className="text-sm text-gray-600">On Base network</div>
              </div>
            </button>

            <button
              onClick={() => setSelectedMethod('fiat')}
              className={`w-full p-3 rounded-lg border-2 transition-all duration-200 flex items-center space-x-3 ${
                selectedMethod === 'fiat'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <CreditCard className="w-5 h-5 text-blue-600" />
              <div className="text-left">
                <div className="font-medium text-gray-900">Pay with Card</div>
                <div className="text-sm text-gray-600">Credit or debit card</div>
              </div>
            </button>
          </div>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={handlePurchase}
            disabled={isLoading}
            className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Processing...' : `Purchase ${formatCurrency(price)}`}
          </button>
        </div>

        <div className="mt-4 text-xs text-gray-500 text-center">
          Secure payment powered by {selectedMethod === 'crypto' ? 'Base' : 'Stripe'}
        </div>
      </div>
    </div>
  );
}
