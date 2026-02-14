// ============================================
// Re-exports from @sudobility/types
// ============================================
export type { ApiResponse, BaseResponse } from '@sudobility/types';

// ============================================
// Request Types
// ============================================

/** Request body for POST /convert */
export interface ConvertRequest {
  /** Base64-encoded raster image (PNG, JPG, WEBP, BMP, GIF) */
  original: string;
  /** Optional filename for metadata */
  filename?: string;
}

// ============================================
// Response Types
// ============================================

/** Result returned from a successful conversion */
export interface ConvertResult {
  /** SVG content as a string */
  svg: string;
  /** Original image width in pixels */
  width: number;
  /** Original image height in pixels */
  height: number;
}

// ============================================
// Response Type Aliases
// ============================================
import type { BaseResponse } from '@sudobility/types';

export type ConvertResponse = BaseResponse<ConvertResult>;

// ============================================
// Helper Functions
// ============================================

export function successResponse<T>(data: T): BaseResponse<T> {
  return {
    success: true,
    data,
    timestamp: new Date().toISOString(),
  };
}

export function errorResponse(error: string): BaseResponse<never> {
  return {
    success: false,
    error,
    timestamp: new Date().toISOString(),
  };
}
