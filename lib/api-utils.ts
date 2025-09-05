import { NextRequest, NextResponse } from 'next/server';
import { supabase } from './supabase';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export function createApiResponse<T>(
  data?: T,
  error?: string,
  status: number = 200
): NextResponse<ApiResponse<T>> {
  const response: ApiResponse<T> = {
    success: !error,
    ...(data && { data }),
    ...(error && { error }),
  };

  return NextResponse.json(response, { status });
}

export function createErrorResponse(
  error: string,
  status: number = 400
): NextResponse<ApiResponse> {
  return createApiResponse(undefined, error, status);
}

export async function validateRequest(
  request: NextRequest,
  requiredFields: string[] = []
): Promise<{ isValid: boolean; data?: any; error?: string }> {
  try {
    const data = await request.json();
    
    for (const field of requiredFields) {
      if (!data[field]) {
        return {
          isValid: false,
          error: `Missing required field: ${field}`,
        };
      }
    }

    return { isValid: true, data };
  } catch (error) {
    return {
      isValid: false,
      error: 'Invalid JSON in request body',
    };
  }
}

export async function getCurrentUser(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader) {
    return null;
  }

  const token = authHeader.replace('Bearer ', '');
  const { data: { user }, error } = await supabase.auth.getUser(token);
  
  if (error || !user) {
    return null;
  }

  return user;
}

export function handleApiError(error: any): NextResponse<ApiResponse> {
  console.error('API Error:', error);
  
  if (error.code === 'PGRST116') {
    return createErrorResponse('Resource not found', 404);
  }
  
  if (error.code === '23505') {
    return createErrorResponse('Resource already exists', 409);
  }
  
  return createErrorResponse(
    error.message || 'Internal server error',
    500
  );
}

export function validatePagination(searchParams: URLSearchParams) {
  const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
  const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '10')));
  const offset = (page - 1) * limit;
  
  return { page, limit, offset };
}

export function buildSearchQuery(searchParams: URLSearchParams) {
  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';
  const skills = searchParams.get('skills')?.split(',').filter(Boolean) || [];
  const vetted = searchParams.get('vetted') === 'true';
  
  return { search, category, skills, vetted };
}
