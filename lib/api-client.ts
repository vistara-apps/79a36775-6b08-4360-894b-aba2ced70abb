import { ApiResponse } from './api-utils';

class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string = '/api') {
    this.baseUrl = baseUrl;
  }

  setToken(token: string) {
    this.token = token;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    const data = await response.json();
    return data;
  }

  // Gigs API
  async getGigs(params?: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    skills?: string[];
    vetted?: boolean;
  }) {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', params.page.toString());
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    if (params?.search) searchParams.set('search', params.search);
    if (params?.category) searchParams.set('category', params.category);
    if (params?.skills?.length) searchParams.set('skills', params.skills.join(','));
    if (params?.vetted) searchParams.set('vetted', 'true');

    return this.request(`/gigs?${searchParams.toString()}`);
  }

  async createGig(gigData: any) {
    return this.request('/gigs', {
      method: 'POST',
      body: JSON.stringify(gigData),
    });
  }

  // Guides API
  async getGuides(params?: {
    page?: number;
    limit?: number;
    search?: string;
    skill_tag?: string;
    is_premium?: boolean;
    difficulty?: string;
  }) {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', params.page.toString());
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    if (params?.search) searchParams.set('search', params.search);
    if (params?.skill_tag) searchParams.set('skill_tag', params.skill_tag);
    if (params?.is_premium !== undefined) searchParams.set('is_premium', params.is_premium.toString());
    if (params?.difficulty) searchParams.set('difficulty', params.difficulty);

    return this.request(`/guides?${searchParams.toString()}`);
  }

  async createGuide(guideData: any) {
    return this.request('/guides', {
      method: 'POST',
      body: JSON.stringify(guideData),
    });
  }

  // Users API
  async getCurrentUser() {
    return this.request('/users');
  }

  async createUser(userData: any) {
    return this.request('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async updateUser(userData: any) {
    return this.request('/users', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  // Auth API
  async authenticateWithFarcaster(authData: {
    fid: number;
    signature?: string;
    message?: string;
    walletAddress?: string;
  }) {
    return this.request('/auth/farcaster', {
      method: 'POST',
      body: JSON.stringify(authData),
    });
  }

  async getNonce() {
    return this.request('/auth/farcaster?action=nonce');
  }

  // AI API
  async generatePitch(pitchData: {
    skillTag: string;
    experience: string;
    gigId?: string;
    tone?: 'professional' | 'casual' | 'enthusiastic';
  }) {
    return this.request('/ai/generate-pitch', {
      method: 'POST',
      body: JSON.stringify(pitchData),
    });
  }

  async getPitchTemplate(templateId: string) {
    return this.request(`/ai/generate-pitch?templateId=${templateId}`);
  }

  // Payments API
  async createPrivyPayment(guideId: string) {
    return this.request(`/payments/privy?guideId=${guideId}`);
  }

  async confirmPrivyPayment(paymentData: {
    guideId: string;
    transactionHash: string;
  }) {
    return this.request('/payments/privy', {
      method: 'POST',
      body: JSON.stringify(paymentData),
    });
  }

  async createStripePayment(paymentData: {
    guideId: string;
    amount: number;
  }) {
    return this.request('/payments/stripe', {
      method: 'POST',
      body: JSON.stringify(paymentData),
    });
  }
}

export const apiClient = new ApiClient();
