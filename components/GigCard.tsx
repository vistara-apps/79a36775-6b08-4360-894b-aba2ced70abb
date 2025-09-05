'use client';

import { useState } from 'react';
import { ExternalLink, Bookmark, BookmarkCheck, MapPin, Clock, DollarSign } from 'lucide-react';
import { Gig } from '@/lib/types';
import { formatDate, truncateText, cn } from '@/lib/utils';

interface GigCardProps {
  gig: Gig;
  onSave?: (gigId: string) => void;
  isSaved?: boolean;
}

export function GigCard({ gig, onSave, isSaved = false }: GigCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [saved, setSaved] = useState(isSaved);

  const handleSave = () => {
    setSaved(!saved);
    onSave?.(gig.gigId);
  };

  const handleViewGig = () => {
    window.open(gig.url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="gig-card animate-fade-in">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-1">
            <h3 className="text-lg font-semibold text-gray-900 leading-tight">
              {gig.title}
            </h3>
            {gig.vetted && (
              <div className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
                Vetted
              </div>
            )}
          </div>
          <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
            <div className="flex items-center space-x-1">
              <MapPin className="w-3 h-3" />
              <span>{gig.source}</span>
            </div>
            <div className="flex items-center space-x-1">
              <DollarSign className="w-3 h-3" />
              <span>{gig.payRate}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="w-3 h-3" />
              <span>{formatDate(gig.postedDate)}</span>
            </div>
          </div>
        </div>
        <button
          onClick={handleSave}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
        >
          {saved ? (
            <BookmarkCheck className="w-5 h-5 text-blue-600" />
          ) : (
            <Bookmark className="w-5 h-5 text-gray-400" />
          )}
        </button>
      </div>

      <p className="text-sm text-gray-700 leading-relaxed mb-3">
        {isExpanded ? gig.description : truncateText(gig.description, 120)}
        {gig.description.length > 120 && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-blue-600 hover:text-blue-700 ml-1 font-medium"
          >
            {isExpanded ? 'Show less' : 'Show more'}
          </button>
        )}
      </p>

      <div className="flex flex-wrap gap-2 mb-4">
        {gig.skills.map((skill) => (
          <span
            key={skill}
            className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full font-medium"
          >
            {skill}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <div className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full font-medium">
          {gig.category}
        </div>
        <button
          onClick={handleViewGig}
          className="btn-primary text-sm py-2 px-4 flex items-center space-x-1"
        >
          <span>View Gig</span>
          <ExternalLink className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}
