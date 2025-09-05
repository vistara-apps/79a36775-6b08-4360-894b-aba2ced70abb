'use client';

import { useState } from 'react';
import { Clock, Star, Lock, CheckCircle } from 'lucide-react';
import { SkillGuide } from '@/lib/types';
import { formatCurrency, cn } from '@/lib/utils';
import { DIFFICULTY_COLORS } from '@/lib/constants';

interface SkillCardProps {
  guide: SkillGuide;
  onPurchase?: (guideId: string) => void;
  isPurchased?: boolean;
}

export function SkillCard({ guide, onPurchase, isPurchased = false }: SkillCardProps) {
  const [purchased, setPurchased] = useState(isPurchased);

  const handlePurchase = () => {
    if (guide.isPremium && !purchased) {
      setPurchased(true);
      onPurchase?.(guide.guideId);
    }
  };

  const handleAccess = () => {
    // In a real app, this would navigate to the guide content
    console.log('Accessing guide:', guide.guideId);
  };

  return (
    <div className="skill-card animate-fade-in">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-1">
            <h3 className="text-lg font-semibold text-gray-900 leading-tight">
              {guide.title}
            </h3>
            {guide.isPremium && (
              <div className="premium-badge">
                Premium
              </div>
            )}
          </div>
          <div className="flex items-center space-x-3 text-sm text-gray-600 mb-2">
            <div className="flex items-center space-x-1">
              <Clock className="w-3 h-3" />
              <span>{guide.estimatedTime}</span>
            </div>
            <div className={cn(
              "text-xs px-2 py-1 rounded-full font-medium",
              DIFFICULTY_COLORS[guide.difficulty]
            )}>
              {guide.difficulty}
            </div>
          </div>
        </div>
        {(guide.isPremium && purchased) || (!guide.isPremium) ? (
          <CheckCircle className="w-5 h-5 text-green-600" />
        ) : (
          <Lock className="w-5 h-5 text-gray-400" />
        )}
      </div>

      <p className="text-sm text-gray-700 leading-relaxed mb-4">
        {guide.content}
      </p>

      <div className="flex items-center space-x-2 mb-4">
        <div className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full font-medium">
          {guide.skillTag}
        </div>
        <div className="flex items-center space-x-1 text-yellow-500">
          <Star className="w-3 h-3 fill-current" />
          <Star className="w-3 h-3 fill-current" />
          <Star className="w-3 h-3 fill-current" />
          <Star className="w-3 h-3 fill-current" />
          <Star className="w-3 h-3" />
          <span className="text-xs text-gray-600 ml-1">4.2</span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-lg font-semibold text-gray-900">
          {guide.price === 0 ? 'Free' : formatCurrency(guide.price)}
        </div>
        {guide.isPremium && !purchased ? (
          <button
            onClick={handlePurchase}
            className="btn-accent text-sm py-2 px-4"
          >
            Purchase
          </button>
        ) : (
          <button
            onClick={handleAccess}
            className="btn-primary text-sm py-2 px-4"
          >
            {purchased || !guide.isPremium ? 'Access Guide' : 'View Free'}
          </button>
        )}
      </div>
    </div>
  );
}
