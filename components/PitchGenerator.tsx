'use client';

import { useState } from 'react';
import { Copy, RefreshCw, Wand2 } from 'lucide-react';
import { PitchTemplate } from '@/lib/types';
import { CATEGORIES, SKILLS } from '@/lib/constants';

interface PitchGeneratorProps {
  templates: PitchTemplate[];
}

export function PitchGenerator({ templates }: PitchGeneratorProps) {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('');
  const [experience, setExperience] = useState('');
  const [generatedPitch, setGeneratedPitch] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!selectedCategory || !selectedSkill) return;

    setIsGenerating(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Find matching template
    const template = templates.find(t => 
      t.category === selectedCategory || t.skillTag === selectedSkill
    ) || templates[0];
    
    // Generate personalized pitch
    const personalizedPitch = template.content
      .replace('[X]', experience || '2')
      .replace('[industry]', selectedCategory.toLowerCase())
      .replace('[technologies]', selectedSkill)
      .replace('[number]', Math.floor(Math.random() * 20 + 5).toString())
      .replace('[specific project details]', `your ${selectedCategory.toLowerCase()} project`);
    
    setGeneratedPitch(personalizedPitch);
    setIsGenerating(false);
  };

  const handleCopy = async () => {
    if (!generatedPitch) return;
    
    try {
      await navigator.clipboard.writeText(generatedPitch);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  const handleRefresh = () => {
    if (generatedPitch) {
      handleGenerate();
    }
  };

  return (
    <div className="space-y-6">
      <div className="glass-card p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Wand2 className="w-5 h-5 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900">Pitch Generator</h2>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select a category</option>
              {CATEGORIES.slice(1).map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Primary Skill
            </label>
            <select
              value={selectedSkill}
              onChange={(e) => setSelectedSkill(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select your main skill</option>
              {SKILLS.map((skill) => (
                <option key={skill} value={skill}>
                  {skill}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Years of Experience
            </label>
            <input
              type="text"
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              placeholder="e.g., 3"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={!selectedCategory || !selectedSkill || isGenerating}
            className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Generating...</span>
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4" />
                <span>Generate Pitch</span>
              </>
            )}
          </button>
        </div>
      </div>

      {generatedPitch && (
        <div className="glass-card p-6 animate-slide-up">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Your Generated Pitch</h3>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleRefresh}
                className="p-2 text-gray-600 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors duration-200"
                title="Generate new version"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <button
                onClick={handleCopy}
                className="p-2 text-gray-600 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors duration-200"
                title="Copy to clipboard"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-blue-500">
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
              {generatedPitch}
            </p>
          </div>
          
          {copied && (
            <div className="mt-2 text-sm text-green-600 font-medium">
              ✓ Copied to clipboard!
            </div>
          )}
        </div>
      )}
    </div>
  );
}
