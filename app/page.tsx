'use client';

import { useState, useEffect } from 'react';
import { useMiniKit } from '@coinbase/onchainkit/minikit';
import { AppShell } from '@/components/AppShell';
import { GigCard } from '@/components/GigCard';
import { SkillCard } from '@/components/SkillCard';
import { PitchGenerator } from '@/components/PitchGenerator';
import { FilterBar } from '@/components/FilterBar';
import { Paywall } from '@/components/Paywall';
import { mockGigs, mockSkillGuides, mockPitchTemplates } from '@/lib/mockData';
import { FilterOptions, Gig, SkillGuide } from '@/lib/types';
import { Search, TrendingUp, BookOpen, Users } from 'lucide-react';

export default function HomePage() {
  const { setFrameReady } = useMiniKit();
  const [activeTab, setActiveTab] = useState<'gigs' | 'guides' | 'profile'>('gigs');
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterOptions>({
    category: 'All',
    payRange: 'All',
    skills: []
  });
  const [savedGigs, setSavedGigs] = useState<string[]>([]);
  const [purchasedGuides, setPurchasedGuides] = useState<string[]>([]);
  const [showPaywall, setShowPaywall] = useState<{ guide: SkillGuide } | null>(null);
  const [isPaymentLoading, setIsPaymentLoading] = useState(false);

  // Initialize MiniKit
  useEffect(() => {
    setFrameReady();
  }, [setFrameReady]);

  // Filter gigs based on search and filters
  const filteredGigs = mockGigs.filter((gig) => {
    const matchesSearch = gig.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         gig.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = filters.category === 'All' || gig.category === filters.category;
    
    const matchesSkills = filters.skills.length === 0 || 
                         filters.skills.some(skill => gig.skills.includes(skill));
    
    return matchesSearch && matchesCategory && matchesSkills;
  });

  // Filter skill guides based on search
  const filteredGuides = mockSkillGuides.filter((guide) =>
    guide.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    guide.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    guide.skillTag.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSaveGig = (gigId: string) => {
    setSavedGigs(prev => 
      prev.includes(gigId) 
        ? prev.filter(id => id !== gigId)
        : [...prev, gigId]
    );
  };

  const handlePurchaseGuide = (guideId: string) => {
    const guide = mockSkillGuides.find(g => g.guideId === guideId);
    if (guide && guide.isPremium && !purchasedGuides.includes(guideId)) {
      setShowPaywall({ guide });
    }
  };

  const handlePayment = async (method: 'crypto' | 'fiat') => {
    if (!showPaywall) return;
    
    setIsPaymentLoading(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setPurchasedGuides(prev => [...prev, showPaywall.guide.guideId]);
    setShowPaywall(null);
    setIsPaymentLoading(false);
  };

  const renderGigsTab = () => (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="glass-card p-6 text-center">
        <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <TrendingUp className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-xl font-semibold text-gray-900 mb-2">
          Discover Curated Gigs
        </h1>
        <p className="text-sm text-gray-600 leading-relaxed">
          Find legitimate, vetted online earning opportunities tailored to your skills
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search gigs..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Filters */}
      <FilterBar filters={filters} onFiltersChange={setFilters} />

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="glass-card p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{filteredGigs.length}</div>
          <div className="text-xs text-gray-600">Available Gigs</div>
        </div>
        <div className="glass-card p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{savedGigs.length}</div>
          <div className="text-xs text-gray-600">Saved Gigs</div>
        </div>
        <div className="glass-card p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">
            {mockGigs.filter(g => g.vetted).length}
          </div>
          <div className="text-xs text-gray-600">Vetted</div>
        </div>
      </div>

      {/* Gigs List */}
      <div className="space-y-4">
        {filteredGigs.length > 0 ? (
          filteredGigs.map((gig) => (
            <GigCard
              key={gig.gigId}
              gig={gig}
              onSave={handleSaveGig}
              isSaved={savedGigs.includes(gig.gigId)}
            />
          ))
        ) : (
          <div className="glass-card p-8 text-center">
            <div className="text-gray-400 mb-2">No gigs found</div>
            <div className="text-sm text-gray-600">
              Try adjusting your search or filters
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderGuidesTab = () => (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="glass-card p-6 text-center">
        <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <BookOpen className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-xl font-semibold text-gray-900 mb-2">
          Micro-Skill Guides
        </h1>
        <p className="text-sm text-gray-600 leading-relaxed">
          Quick, actionable guides to start earning with in-demand skills
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search guides..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="glass-card p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">{filteredGuides.length}</div>
          <div className="text-xs text-gray-600">Total Guides</div>
        </div>
        <div className="glass-card p-4 text-center">
          <div className="text-2xl font-bold text-green-600">
            {filteredGuides.filter(g => !g.isPremium).length}
          </div>
          <div className="text-xs text-gray-600">Free Guides</div>
        </div>
        <div className="glass-card p-4 text-center">
          <div className="text-2xl font-bold text-orange-600">{purchasedGuides.length}</div>
          <div className="text-xs text-gray-600">Purchased</div>
        </div>
      </div>

      {/* Guides List */}
      <div className="space-y-4">
        {filteredGuides.length > 0 ? (
          filteredGuides.map((guide) => (
            <SkillCard
              key={guide.guideId}
              guide={guide}
              onPurchase={handlePurchaseGuide}
              isPurchased={purchasedGuides.includes(guide.guideId)}
            />
          ))
        ) : (
          <div className="glass-card p-8 text-center">
            <div className="text-gray-400 mb-2">No guides found</div>
            <div className="text-sm text-gray-600">
              Try adjusting your search
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderProfileTab = () => (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="glass-card p-6 text-center">
        <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Users className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-xl font-semibold text-gray-900 mb-2">
          Profile Optimizer
        </h1>
        <p className="text-sm text-gray-600 leading-relaxed">
          Create compelling profiles and pitches to land your first gig
        </p>
      </div>

      {/* Pitch Generator */}
      <PitchGenerator templates={mockPitchTemplates} />

      {/* Profile Tips */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Tips</h3>
        <div className="space-y-3">
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
            <div>
              <div className="font-medium text-gray-900">Use a professional photo</div>
              <div className="text-sm text-gray-600">Clear headshot with good lighting</div>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
            <div>
              <div className="font-medium text-gray-900">Highlight your best work</div>
              <div className="text-sm text-gray-600">Showcase 3-5 relevant portfolio pieces</div>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
            <div>
              <div className="font-medium text-gray-900">Write a compelling headline</div>
              <div className="text-sm text-gray-600">Focus on the value you provide</div>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
            <div>
              <div className="font-medium text-gray-900">Include relevant keywords</div>
              <div className="text-sm text-gray-600">Help clients find you in searches</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <AppShell activeTab={activeTab} onTabChange={setActiveTab}>
        {activeTab === 'gigs' && renderGigsTab()}
        {activeTab === 'guides' && renderGuidesTab()}
        {activeTab === 'profile' && renderProfileTab()}
      </AppShell>

      {showPaywall && (
        <Paywall
          title={showPaywall.guide.title}
          price={showPaywall.guide.price}
          description="Unlock this premium guide to accelerate your earning potential"
          onPurchase={handlePayment}
          isLoading={isPaymentLoading}
        />
      )}
    </>
  );
}
