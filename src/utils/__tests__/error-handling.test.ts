
import { describe, it, expect, vi } from 'vitest';
import { 
  ApiError, 
  createSuccessResult, 
  createErrorResult, 
  handleApiError,
  showErrorToast,
  showSuccessToast
} from '../error-handling';

// Mock the toast functions
vi.mock('@/hooks/use-toast', () => ({
  toast: vi.fn(),
  useToast: () => ({
    toast: vi.fn()
  })
}));

describe('Error Handling Utilities', () => {
  describe('ApiError', () => {
    it('should create an ApiError with the correct properties', () => {
      const error = new ApiError('Test error', 'TEST_CODE', 400);
      
      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(ApiError);
      expect(error.message).toBe('Test error');
      expect(error.code).toBe('TEST_CODE');
      expect(error.status).toBe(400);
    });
  });
  
  describe('createSuccessResult', () => {
    it('should create a success result with the correct data', () => {
      const data = { id: '1', name: 'Test' };
      const result = createSuccessResult(data);
      
      expect(result).toEqual({
        data,
        error: null,
        success: true
      });
    });
  });
  
  describe('createErrorResult', () => {
    it('should create an error result with the correct message', () => {
      const result = createErrorResult('Error message', 'ERROR_CODE');
      
      expect(result).toEqual({
        data: null,
        error: 'Error message',
        success: false
      });
    });
  });
  
  describe('handleApiError', () => {
    it('should handle ApiError correctly', () => {
      const apiError = new ApiError('API Error', 'API_ERROR');
      const result = handleApiError(apiError);
      
      expect(result).toEqual({
        data: null,
        error: 'API Error',
        success: false
      });
    });
    
    it('should handle standard Error correctly', () => {
      const error = new Error('Standard error');
      const result = handleApiError(error);
      
      expect(result).toEqual({
        data: null,
        error: 'Standard error',
        success: false
      });
    });
    
    it('should handle unknown error types', () => {
      const result = handleApiError('string error');
      
      expect(result).toEqual({
        data: null,
        error: 'An unknown error occurred',
        success: false
      });
    });
  });
});
