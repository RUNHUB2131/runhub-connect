
import { expect, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import matchers from '@testing-library/jest-dom/matchers';
import '@testing-library/jest-dom';

// Extend Vitest's expect method with jest-dom's matchers
expect.extend(matchers);

// Configure global mocks here
// For example, mock ResizeObserver which is not available in test env
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Run cleanup after each test
afterEach(() => {
  cleanup();
});
