# @sudobility/svgr_types

Shared TypeScript type definitions and response helpers for the SVGR image-to-SVG conversion platform.

## Installation

```bash
bun add @sudobility/svgr_types
```

## Usage

```typescript
import {
  ConvertRequest,
  ConvertResult,
  ConvertResponse,
  successResponse,
  errorResponse,
} from "@sudobility/svgr_types";

const result: ConvertResult = { svg: "<svg>...</svg>", width: 100, height: 100 };
const response = successResponse(result);
```

## Types

| Type | Description |
|------|-------------|
| `ConvertRequest` | Input payload: `original` (base64), `filename`, `quality` (1-10), `transparentBg` |
| `ConvertResult` | Output: `svg` string, `width`, `height` |
| `ConvertResponse` | Full API response wrapping `ConvertResult` |

### Response Helpers

- `successResponse(result)` -- wrap result into success response
- `errorResponse(message)` -- create error response

### Re-exports from @sudobility/types

`ApiResponse<T>`, `BaseResponse`

## Development

```bash
bun run build        # Dual CJS + ESM build
bun test             # Run tests
bun run verify       # All checks + build
```

## Related Packages

- `svgr_client` -- API client SDK
- `svgr_lib` -- Shared business logic
- `svgr_api` -- Backend API server
- `svgr_app` -- Web app
- `svgr_app_rn` -- React Native app

## License

BUSL-1.1
