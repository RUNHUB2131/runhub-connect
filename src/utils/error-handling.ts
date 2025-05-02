
import { toast } from "@/hooks/use-toast";

export type ApiResult<T> = {
  data: T | null;
  error: string | null;
  success: boolean;
};

export class ApiError extends Error {
  public code?: string;
  public status?: number;
  
  constructor(message: string, code?: string, status?: number) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.status = status;
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

export function createSuccessResult<T>(data: T): ApiResult<T> {
  return {
    data,
    error: null,
    success: true
  };
}

export function createErrorResult<T>(message: string, code?: string): ApiResult<T> {
  return {
    data: null,
    error: message,
    success: false
  };
}

export function handleApiError<T>(error: unknown): ApiResult<T> {
  console.error('API Error:', error);
  
  if (error instanceof ApiError) {
    return createErrorResult(error.message, error.code);
  }
  
  if (error instanceof Error) {
    return createErrorResult(error.message);
  }
  
  return createErrorResult('An unknown error occurred');
}

// Consistent toast notifications for errors
export function showErrorToast(error: string | unknown) {
  const message = error instanceof Error ? error.message : 
                  typeof error === 'string' ? error : 
                  'An unexpected error occurred';
  
  toast({
    title: "Error",
    description: message,
    variant: "destructive",
  });
}

// Consistent toast notifications for success
export function showSuccessToast(message: string) {
  toast({
    title: "Success",
    description: message,
  });
}
