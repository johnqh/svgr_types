/**
 * @fileoverview SVGR type definitions - shared contract between API and clients.
 * Provides types for image-to-SVG conversion requests/responses and helper functions
 * for constructing standardized API responses.
 * @module @sudobility/svgr_types
 */

// ============================================
// Re-exports from @sudobility/types
// ============================================
export type {
  ApiResponse,
  BaseResponse,
  ConsumableBalanceResponse,
  ConsumableUseResponse,
  ConsumablePurchaseRecord,
  ConsumableUsageRecord,
} from '@sudobility/types';

// Local import for use in type aliases and helper functions below
import type {
  BaseResponse,
  ConsumableBalanceResponse,
  ConsumableUseResponse,
  ConsumablePurchaseRecord,
  ConsumableUsageRecord,
} from '@sudobility/types';

// ============================================
// Request Types
// ============================================

/**
 * Controls how the image is preprocessed before vectorization.
 * - `auto` — auto-detect whether the image is a photo or design
 * - `photo` — reduce colors before vectorization (best for photographs)
 * - `design` — pass through unchanged (best for logos, illustrations, icons)
 */
export type ImageType = 'auto' | 'photo' | 'design';

/** All valid ImageType values. */
export const IMAGE_TYPES: readonly ImageType[] = ['auto', 'photo', 'design'] as const;

/**
 * Request payload for POST /convert endpoint.
 *
 * Contains a raster image to be converted to SVG along with optional conversion parameters.
 *
 * @interface ConvertRequest
 * @property {string} original - Base64-encoded raster image data (PNG, JPG, WEBP, BMP, or GIF format)
 * @property {string} [filename] - Optional filename for metadata or audit purposes
 * @property {number} [quality] - Conversion quality level from 1 to 10, where 1 produces the smallest file
 *   and 10 produces the highest fidelity output. Default is 5 for balanced results.
 * @property {boolean} [transparentBg] - If true, removes the background from the resulting SVG,
 *   making it transparent. Default is false.
 *
 * @example
 * const request: ConvertRequest = {
 *   original: 'data:image/png;base64,...',
 *   filename: 'logo.png',
 *   quality: 7,
 *   transparentBg: true
 * };
 */
export interface ConvertRequest {
  /** Base64-encoded raster image (PNG, JPG, WEBP, BMP, GIF) */
  original: string;
  /** Optional filename for metadata */
  filename?: string;
  /** Quality level 1-10 (1 = smallest file, 10 = highest fidelity). Default: 5 */
  quality?: number;
  /** Remove the background from the SVG, making it transparent. Default: false */
  transparentBg?: boolean;
  /** Run OCR to detect text and emit editable SVG `<text>` elements. Default: true */
  ocr?: boolean;
  /** Aggressively merge small and thin vector paths into their neighbors. Default: true */
  mergePaths?: boolean;
  /** Smoothing level 0-3 for the output SVG paths. Default: 0 (no smoothing) */
  smooth?: number;
  /** Image type for preprocessing. Default: 'auto' */
  imageType?: ImageType;
}

// ============================================
// Response Types
// ============================================

/**
 * Result returned from a successful SVG conversion.
 *
 * Contains a cache ID for retrieving the converted SVG and metadata about the
 * original image dimensions. The SVG content is stored server-side and can be
 * fetched separately via `GET /api/v1/svg/:cacheId` which returns the raw SVG
 * with `Content-Type: image/svg+xml`.
 *
 * @interface ConvertResult
 * @property {string} cacheId - Unique ID for retrieving the cached SVG from `GET /api/v1/svg/:cacheId`
 * @property {number} width - Width of the original raster image in pixels
 * @property {number} height - Height of the original raster image in pixels
 *
 * @example
 * const result: ConvertResult = {
 *   cacheId: 'abc123-def456',
 *   width: 500,
 *   height: 500
 * };
 */
export interface ConvertResult {
  /** Unique ID for retrieving the cached SVG via GET /api/v1/svg/:cacheId */
  cacheId: string;
  /** Original image width in pixels */
  width: number;
  /** Original image height in pixels */
  height: number;
}

// ============================================
// Response Type Aliases
// ============================================
/**
 * Full API response for conversion requests.
 *
 * A discriminated union type that wraps a {@link ConvertResult} in the standard response envelope.
 * When success is true, includes the conversion result; when false, includes an error message.
 *
 * This type alias uses the {@link BaseResponse} generic from @sudobility/types, which provides:
 * - `success: boolean` - Whether the operation succeeded
 * - `data?: ConvertResult` - Present only when success is true
 * - `error?: string` - Present only when success is false
 * - `timestamp: string` - ISO 8601 timestamp of the response
 *
 * @typedef {BaseResponse<ConvertResult>} ConvertResponse
 *
 * @example
 * // Success response
 * const success: ConvertResponse = {
 *   success: true,
 *   data: { cacheId: 'abc123-def456', width: 500, height: 500 },
 *   timestamp: '2026-02-23T12:34:56.789Z'
 * };
 *
 * @example
 * // Error response
 * const error: ConvertResponse = {
 *   success: false,
 *   error: 'Invalid image format',
 *   timestamp: '2026-02-23T12:34:56.789Z'
 * };
 */
export type ConvertResponse = BaseResponse<ConvertResult>;

// ============================================
// Consumable Response Type Aliases
// ============================================

/** API response for GET /consumables/balance */
export type BalanceResponse = BaseResponse<ConsumableBalanceResponse>;

/** API response for POST /consumables/purchase */
export type PurchaseResponse = BaseResponse<ConsumableBalanceResponse>;

/** API response for POST /consumables/use */
export type UseResponse = BaseResponse<ConsumableUseResponse>;

/** API response for GET /consumables/purchases */
export type PurchaseHistoryResponse = BaseResponse<ConsumablePurchaseRecord[]>;

/** API response for GET /consumables/usages */
export type UsageHistoryResponse = BaseResponse<ConsumableUsageRecord[]>;

/**
 * Result data from the RevenueCat webhook handler.
 *
 * @property {boolean} alreadyProcessed - Whether this transaction was already recorded (idempotent replay)
 * @property {number} balance - The user's current credit balance after processing
 */
export interface WebhookResult {
  /** Whether this transaction was already recorded (idempotent replay) */
  alreadyProcessed: boolean;
  /** The user's current credit balance after processing */
  balance: number;
}

/** API response for POST /consumables/webhook */
export type WebhookResponse = BaseResponse<WebhookResult>;

/**
 * API response for acknowledgement messages (e.g., ignored webhook events).
 *
 * @property {string} message - A human-readable message describing the acknowledgement
 */
export interface AckResult {
  /** A human-readable acknowledgement message */
  message: string;
}

/** API response with a simple acknowledgement message */
export type AckResponse = BaseResponse<AckResult>;

/** API response for the GET /health endpoint */
export interface HealthResult {
  /** Server health status */
  status: string;
}

/** API response for the health check endpoint */
export type HealthResponse = BaseResponse<HealthResult>;

// ============================================
// Helper Functions
// ============================================

/**
 * Constructs a successful API response with the given data.
 *
 * Wraps arbitrary data in the standard {@link BaseResponse} success envelope with a current timestamp.
 * The generic type parameter T allows the data to be any shape.
 *
 * @template T - The type of data being returned
 * @param {T} data - The conversion result or other data to include in the success response
 * @returns {BaseResponse<T>} A success response object with success=true, data, and timestamp
 *
 * @example
 * // For ConvertResult
 * const response = successResponse({
 *   cacheId: 'abc123-def456',
 *   width: 100,
 *   height: 100
 * });
 * // Returns:
 * // {
 * //   success: true,
 * //   data: { cacheId: 'abc123-def456', width: 100, height: 100 },
 * //   timestamp: '2026-02-23T12:34:56.789Z'
 * // }
 *
 * @example
 * // Generic usage with any data type
 * const msgResponse = successResponse({ message: 'Processing started' });
 * // Returns:
 * // {
 * //   success: true,
 * //   data: { message: 'Processing started' },
 * //   timestamp: '2026-02-23T12:34:56.789Z'
 * // }
 */
export function successResponse<T>(data: T): BaseResponse<T> {
  return {
    success: true,
    data,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Constructs an error API response with the given error message.
 *
 * Creates a standard {@link BaseResponse} error envelope with success=false, no data field,
 * and a current timestamp. The return type uses `never` for the generic parameter to indicate
 * that successful data cannot exist in error responses.
 *
 * @param {string} error - A descriptive error message
 * @returns {BaseResponse<never>} An error response object with success=false, error message, and timestamp
 *
 * @example
 * // For conversion errors
 * const response = errorResponse('Invalid image format: expected PNG, JPG, WEBP, BMP, or GIF');
 * // Returns:
 * // {
 * //   success: false,
 * //   error: 'Invalid image format: expected PNG, JPG, WEBP, BMP, or GIF',
 * //   timestamp: '2026-02-23T12:34:56.789Z'
 * // }
 *
 * @example
 * // For other errors
 * const response = errorResponse('Quality must be between 1 and 10');
 * // Returns:
 * // {
 * //   success: false,
 * //   error: 'Quality must be between 1 and 10',
 * //   timestamp: '2026-02-23T12:34:56.789Z'
 * // }
 */
export function errorResponse(error: string): BaseResponse<never> {
  return {
    success: false,
    error,
    timestamp: new Date().toISOString(),
  };
}
