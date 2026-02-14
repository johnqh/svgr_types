import { describe, it, expect } from 'vitest';
import { successResponse, errorResponse } from './index';

describe('successResponse', () => {
  it('returns a success response with data', () => {
    const result = successResponse({ svg: '<svg/>', width: 100, height: 100 });
    expect(result.success).toBe(true);
    expect(result.data).toEqual({ svg: '<svg/>', width: 100, height: 100 });
    expect(result.timestamp).toBeDefined();
  });

  it('includes an ISO timestamp', () => {
    const before = new Date().toISOString();
    const result = successResponse('test');
    const after = new Date().toISOString();
    expect(result.timestamp >= before).toBe(true);
    expect(result.timestamp <= after).toBe(true);
  });
});

describe('errorResponse', () => {
  it('returns an error response with message', () => {
    const result = errorResponse('something went wrong');
    expect(result.success).toBe(false);
    expect(result.error).toBe('something went wrong');
    expect(result.timestamp).toBeDefined();
  });

  it('does not include data field', () => {
    const result = errorResponse('fail');
    expect(result).not.toHaveProperty('data');
  });
});
