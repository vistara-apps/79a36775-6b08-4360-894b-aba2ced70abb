'use client';

import { useState } from 'react';
import { Filter, X } from 'lucide-react';
import { CATEGORIES, PAY_RANGES, SKILLS } from '@/lib/constants';
import { FilterOptions } from '@/lib/types';
import { cn } from '@/lib/utils';

interface FilterBarProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
}

export function FilterBar({ filters, onFiltersChange }: FilterBarProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleCategoryChange = (category: string) => {
    onFiltersChange({ ...filters, category });
  };

  const handlePayRangeChange = (payRange: string) => {
    onFiltersChange({ ...filters, payRange });
  };

  const handleSkillToggle = (skill: string) => {
    const newSkills = filters.skills.includes(skill)
      ? filters.skills.filter(s => s !== skill)
      : [...filters.skills, skill];
    onFiltersChange({ ...filters, skills: newSkills });
  };

  const clearFilters = () => {
    onFiltersChange({ category: 'All', payRange: 'All', skills: [] });
  };

  const hasActiveFilters = filters.category !== 'All' || filters.payRange !== 'All' || filters.skills.length > 0;

  return (
    <div className="glass-card p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-gray-600" />
          <span className="font-medium text-gray-900">Filters</span>
          {hasActiveFilters && (
            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
              {(filters.category !== 'All' ? 1 : 0) + 
               (filters.payRange !== 'All' ? 1 : 0) + 
               filters.skills.length}
            </span>
          )}
        </div>
        <div className="flex items-center space-x-2">
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-sm text-gray-600 hover:text-red-600 transition-colors duration-200"
            >
              Clear all
            </button>
          )}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 rounded-lg hover:bg-gray-100 transition-colors duration-200"
          >
            <X className={cn(
              "w-4 h-4 text-gray-600 transition-transform duration-200",
              isExpanded ? "rotate-45" : "rotate-0"
            )} />
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="space-y-4 animate-slide-up">
          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategoryChange(category)}
                  className={cn(
                    "px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200",
                    filters.category === category
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  )}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Pay Range Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pay Range
            </label>
            <div className="flex flex-wrap gap-2">
              {PAY_RANGES.map((range) => (
                <button
                  key={range}
                  onClick={() => handlePayRangeChange(range)}
                  className={cn(
                    "px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200",
                    filters.payRange === range
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  )}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>

          {/* Skills Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Skills
            </label>
            <div className="flex flex-wrap gap-2">
              {SKILLS.map((skill) => (
                <button
                  key={skill}
                  onClick={() => handleSkillToggle(skill)}
                  className={cn(
                    "px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200",
                    filters.skills.includes(skill)
                      ? "bg-cyan-500 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  )}
                >
                  {skill}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
