# Testing

## Setup

- **Framework**: Vitest 4.x
- **Coverage**: @vitest/coverage-v8, 80% threshold on branches/functions/lines/statements
- **Config**: `test/vitest.config.ts` — passed explicitly via `--config`, since it does not sit at the project root

## Commands

```bash
npm run test              # Run all tests
npm run test:coverage     # Run with coverage report (thresholds enforced, used in CI)
npm run typecheck         # tsc --noEmit over src/ and test/
```

## Test Organization

All tests live in `test/unit/` with the naming convention `*.spec.ts`. Each spec file maps to a source module:

| Test File | Tests For |
|-----------|-----------|
| `get-path-value.spec.ts` | `getPathValue()` — nested access, arrays, primitives |
| `set-path-value.spec.ts` | `setPathValue()` — creation, updates, auto-creation |
| `expand-path.spec.ts` | `expandPath()` — wildcard and globstar expansion |
| `get-path-info.spec.ts` | `getPathInfo()` — PathInfo introspection |
| `remove-path.spec.ts` | `removePath()` — property deletion |
| `path-to-array.spec.ts` | `pathToArray()` — string parsing, escaping |
| `array-to-path.spec.ts` | `arrayToPath()` — array to string conversion |
| `path.spec.ts` | Integration / Path type tests |

## Conventions

- Tests use Vitest's `describe`/`it`/`expect` API
- Each function has its own spec file — follow this pattern for new functions
- `path.spec.ts` asserts types via `assertType`, which is a no-op at runtime — those
  assertions are validated by `npm run typecheck`, not by the test run
- No mocking — tests operate on plain objects directly
