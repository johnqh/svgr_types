import { describe, it, expect, expectTypeOf } from 'vitest';
import type { ConvertRequest, ConvertResult, ConvertResponse, BaseResponse } from './index';
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

// ============================================
// Type-Level Tests (using Vitest's expectTypeOf)
// ============================================

describe('Type-level tests for ConvertResponse', () => {
  it('ConvertResponse is a discriminated union of BaseResponse<ConvertResult>', () => {
    // Verify that ConvertResponse is exactly what we expect
    expectTypeOf<ConvertResponse>().toMatchTypeOf<BaseResponse<ConvertResult>>();
  });

  it('successResponse returns correct generic type for ConvertResult', () => {
    const data: ConvertResult = { svg: '<svg/>', width: 100, height: 100 };
    const response = successResponse(data);

    // Type should be BaseResponse<ConvertResult>
    expectTypeOf(response).toMatchTypeOf<BaseResponse<ConvertResult>>();

    // When success is true, data should be accessible
    if (response.success) {
      expectTypeOf(response.data).toMatchTypeOf<ConvertResult>();
    }
  });

  it('successResponse with generic type inference', () => {
    const result = { svg: '<svg/>', width: 100, height: 100 };
    const response = successResponse(result);

    // Should infer the exact type of the input
    expectTypeOf(response).toMatchTypeOf<BaseResponse<{ svg: string; width: number; height: number }>>();
  });

  it('errorResponse returns BaseResponse with never for generic', () => {
    const response = errorResponse('Conversion failed');

    expectTypeOf(response).toMatchTypeOf<BaseResponse<never>>();
    expectTypeOf(response.success).toEqualTypeOf<boolean>();
    expectTypeOf(response.error).toEqualTypeOf<string | undefined>();
  });
});

describe('Type-level tests for discriminated union narrowing', () => {
  it('successResponse creates narrowable success response', () => {
    const response = successResponse({ svg: '<svg/>', width: 100, height: 100 });

    // Type-safe narrowing should work with control flow
    if (response.success) {
      // Inside the if block, TypeScript should narrow to the success type
      expectTypeOf(response.data).toEqualTypeOf<ConvertResult>();
    }
  });

  it('errorResponse creates narrowable error response', () => {
    const response = errorResponse('Failed to convert');

    // Both fields should be accessible in the union
    expectTypeOf(response.success).toEqualTypeOf<boolean>();
    expectTypeOf(response.error).toEqualTypeOf<string | undefined>();
  });
});

describe('Type-level tests for ConvertRequest', () => {
  it('ConvertRequest has required original and optional fields', () => {
    const request: ConvertRequest = {
      original: 'data:image/png;base64,...',
    };

    // original is required
    expectTypeOf(request.original).toMatchTypeOf<string>();

    // Optional fields should have the right types
    if (request.filename !== undefined) {
      expectTypeOf(request.filename).toEqualTypeOf<string>();
    }
    if (request.quality !== undefined) {
      expectTypeOf(request.quality).toEqualTypeOf<number>();
    }
    if (request.transparentBg !== undefined) {
      expectTypeOf(request.transparentBg).toEqualTypeOf<boolean>();
    }
  });
});

describe('Type-level tests for ConvertResult', () => {
  it('ConvertResult has all required fields', () => {
    const result: ConvertResult = {
      svg: '<svg/>',
      width: 100,
      height: 100,
    };

    expectTypeOf(result.svg).toEqualTypeOf<string>();
    expectTypeOf(result.width).toEqualTypeOf<number>();
    expectTypeOf(result.height).toEqualTypeOf<number>();
  });
});
