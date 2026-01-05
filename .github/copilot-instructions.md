# Spillerom - Copilot Agent Instructions

## Repository Overview

**Spillerom** is a Next.js 16 frontend application (Norwegian: "spillerom" = "playroom") that serves as the frontend for the backend service "bakrommet". This is a NAV (Norwegian Labour and Welfare Administration) internal application for case processing.

- **Type**: Next.js 16 web application with TypeScript
- **Size**: ~25,000 lines of TypeScript/TSX code
- **Runtime**: Node.js 24, pnpm 10.26.0
- **Key Technologies**: Next.js 16, React 19, TypeScript, Tailwind CSS, NAV Design System (@navikt/ds-*), TanStack Query, Playwright, Vitest
- **Deployment**: NAIS platform (Kubernetes) on GCP with Azure AD authentication

## Custom Agents

This repository includes custom agents for specialized tasks:

### Playwright Tester Agent

A specialized agent for writing, debugging, and fixing Playwright E2E tests. The agent is configured in `.github/agents/playwright-tester.agent.yml`.

**To use the Playwright tester agent:**
- Provide it with your NPM_AUTH_TOKEN (GitHub token with `read:packages` scope)
- Ask it to write new tests, debug failing tests, or fix test issues
- It has access to Playwright MCP tools and understands the repository's test patterns

**Example usage:**
- "Write a Playwright test for the user login flow"
- "Debug the failing test in personsok.spec.ts"
- "Fix flaky tests in the yrkesaktivitet tests"

The agent automatically:
- Sets up NPM authentication
- Installs dependencies and Playwright browsers
- Runs TypeScript checks before tests
- Uses repository-specific test actions from `/playwright/actions`
- Follows established test patterns and best practices

## Critical Prerequisites

### NPM Authentication Token Required

**ALWAYS set NPM_AUTH_TOKEN before running any pnpm commands.** This repository depends on @navikt packages from GitHub Package Registry.

```bash
export NPM_AUTH_TOKEN=<your-github-token-with-read:packages>
```

Without this token, `pnpm install` will fail with 401 Unauthorized errors. The token must have `read:packages` scope.

## Build & Validation Commands

### Installation (ALWAYS run first)

```bash
# Set token first!
export NPM_AUTH_TOKEN=<token>
pnpm install --frozen-lockfile
```

**Note**: The repository uses `pnpm-workspace.yaml` with security configurations including `ignoreScripts: true` and `preferFrozenLockfile: true`.

### Validation Order (Run in this exact order)

The CI pipeline runs validation steps in this order. **ALWAYS follow this sequence:**

1. **Type checking**: `pnpm run tsc`
2. **Code formatting check**: `pnpm run prettier:check`
3. **Linting**: `pnpm run lint`
4. **Unit tests**: `pnpm run test`

### Building

**Before building, ALWAYS copy the appropriate environment file:**

```bash
# For dev builds
cp .nais/envs/.env.dev .env.production

# For prod builds
cp .nais/envs/.env.prod .env.production

# Then build
pnpm run build
```

**Required environment variable during build:**
- `NEXT_PUBLIC_VERSION` (typically set to git commit SHA)

### Running Locally

```bash
# Development mode (uses .env.development)
pnpm run dev

# Local with lokal environment
pnpm run lokal

# Production mode (requires prior build)
pnpm run start
```

### Testing

**Unit Tests (Vitest):**
```bash
pnpm run test
```

**E2E Tests (Playwright):**

Playwright tests require special setup:

1. Build E2E version: `pnpm run build:e2e` (copies `.nais/envs/.env.playwright` to `.env.production`)
2. Install Playwright browsers: `pnpm exec playwright install`
3. Run tests:
   - Interactive UI: `pnpm run play`
   - Headless: `pnpm run play-headless`
   - In CI: Tests run against a Docker container with sharded execution (4 shards)

**Important**: The `pnpm run tsc` command must complete successfully before running Playwright tests.

### Formatting & Linting

```bash
# Check formatting
pnpm run prettier:check

# Fix formatting
pnpm run prettier:write

# Check linting
pnpm run lint

# Fix linting issues
pnpm run lint:fix

# Format and fix everything
pnpm run format
```

## Project Structure

### Key Directories

```
/src
  /app              - Next.js App Router pages
    /api            - API route handlers
    /oauth2         - OAuth2 authentication flow
    /person         - Person detail pages
    /testscenarioer - Test scenario pages
    layout.tsx      - Root layout with providers
    page.tsx        - Homepage (task list)
  /components       - React components organized by feature
  /hooks            - Custom React hooks
    /mutations      - TanStack Query mutations
    /queries        - TanStack Query queries
  /schemas          - Zod validation schemas
  /types            - TypeScript type definitions
  /utils            - Utility functions
  /styles           - Global CSS styles
  /auth             - Authentication utilities
  /mock-api         - Mock API for local development
  env.ts            - Environment configuration with Zod validation

/playwright         - E2E tests
  /actions          - Reusable test actions
  *.spec.ts         - Test files

/.github
  /workflows        - GitHub Actions workflows
    workflow.yml    - Main workflow (calls next-app.yaml, runs Playwright)
    next-app.yaml   - Build, test, lint, and deploy workflow

/actions            - Reusable GitHub Actions
  /pnpm-cached      - Sets up Node 24, pnpm, and installs dependencies
  /next-to-docker   - Builds Next.js app and pushes to GAR

/.nais              - NAIS deployment configurations
  /envs             - Environment-specific .env files
  nais-dev.yaml     - Dev deployment config
  nais-demo.yaml    - Demo deployment config
```

### Configuration Files

- `package.json` - Dependencies and scripts (packageManager: pnpm@10.26.0)
- `tsconfig.json` - TypeScript config with path aliases (@/, @components/, etc.)
- `next.config.ts` - Next.js config (standalone output, React compiler enabled)
- `eslint.config.ts` - ESLint with Next.js + @navikt/tsm-eslint-react
- `prettier.config.js` - Prettier with Tailwind plugin
- `tailwind.config.ts` - Tailwind with @navikt/ds-tailwind preset
- `vitest.config.mts` - Vitest unit test configuration
- `playwright.config.ts` - Playwright E2E test configuration
- `pnpm-workspace.yaml` - pnpm workspace config with security settings
- `.npmrc` - NPM registry config (requires NPM_AUTH_TOKEN)

## CI/CD Pipeline

### GitHub Actions Workflows

**Main Workflow (workflow.yml)** runs on every push:

1. **next-app job**: Calls next-app.yaml for testing and building
2. **prebuild-app-for-playwright**: Builds E2E Docker image
3. **run-playwright**: Runs tests in 4 parallel shards against Docker container
4. **merge-reports**: Merges Playwright reports and uploads to CDN

**Test & Lint Job (next-app.yaml)**:
- Runs: `pnpm run tsc`, `pnpm run prettier:check`, `pnpm run lint`, `pnpm run test`
- **CRITICAL**: All four commands must pass for the build to succeed

**Build Jobs**:
- `build-dependabot`: Builds for dependabot PRs (uses .env.prod)
- `build-dev`: Builds and deploys to dev environment
- `build-demo`: Builds and deploys to demo environment

### Deployment Environments

- **dev**: Automatic deployment on push (except demo branches)
  - Ingress: spillerom.ansatt.dev.nav.no, spillerom.intern.dev.nav.no
- **demo-main**: Deploy main branch to demo
  - Ingress: spillerom.ekstern.dev.nav.no
- **demo-branch**: Deploy demo/* branches
  - Ingress: spillerom-<branch-name>.ekstern.dev.nav.no

## Common Issues & Workarounds

### 1. NPM Authentication Failures

**Symptom**: `ERR_PNPM_FETCH_401` when running `pnpm install`

**Solution**: Set `NPM_AUTH_TOKEN` environment variable before running any pnpm commands.

### 2. Node Version Mismatch

**Required**: Node.js 24 (specified in engines)

**Current environment may have**: Node.js 20

**Workaround**: Commands should still work but you may see warnings. Consider using nvm to install Node 24.

### 3. Build Requires Environment File

**Symptom**: Build fails with environment validation errors

**Solution**: ALWAYS copy the appropriate .env file before building:
```bash
cp .nais/envs/.env.dev .env.production  # or .env.prod
```

### 4. Playwright Tests Timing

**Local mode** (default): 120-240 second timeout, starts dev server
**Fast mode** (`FAST=1`): 30 second timeout, starts production server (requires `pnpm run build:e2e` first)
**CI mode**: 30 second timeout, expects app already running

### 5. TypeScript Must Pass Before Playwright

The Playwright UI mode runs `pnpm run tsc` before starting tests. If TypeScript errors exist, Playwright won't run.

## Path Aliases

The following path aliases are configured in `tsconfig.json` and `vitest.config.mts`:

- `@/*` → `./src/*`
- `@components/*` → `./src/components/*`
- `@hooks/*` → `./src/hooks/*`
- `@typer/*` → `./src/types/*`
- `@utils/*` → `./src/utils/*`
- `@schemas/*` → `./src/schemas/*`

**ALWAYS use these aliases** in imports instead of relative paths when possible.

## Code Style & Conventions

- **Formatting**: Prettier with @navikt/tsm-prettier + prettier-plugin-tailwindcss
- **Linting**: ESLint with Next.js + @navikt/tsm-eslint-react presets
- **Editor Config**: 4 spaces for most files, 2 spaces for JSON/YAML
- **React**: React 19 with React Compiler enabled, TypeScript strict mode
- **Styling**: Tailwind CSS with NAV Design System (@navikt/ds-tailwind)

## Key Dependencies

- **Next.js 16** with App Router and standalone output
- **React 19** with React Compiler
- **@navikt/ds-react** - NAV Design System components
- **@tanstack/react-query** - Server state management
- **Zod 4.x** - Schema validation (imported from 'zod/v4')
- **Playwright** - E2E testing with sharded execution
- **Vitest** - Unit testing

## Important Notes

1. **ALWAYS set NPM_AUTH_TOKEN** before any pnpm command
2. **Run validation commands in order**: tsc → prettier:check → lint → test
3. **Copy environment file before building** from `.nais/envs/`
4. **Use --frozen-lockfile** when installing dependencies
5. **Never modify pnpm-lock.yaml** manually
6. **TypeScript must pass** before Playwright tests will run
7. **Use path aliases** (@/, @components/, etc.) in imports
8. **Follow the CI pipeline order** when validating changes locally

## Quick Reference

```bash
# Initial setup
export NPM_AUTH_TOKEN=<token>
pnpm install --frozen-lockfile

# Full validation (same as CI)
pnpm run tsc
pnpm run prettier:check
pnpm run lint
pnpm run test

# Development
pnpm run dev  # Starts on http://localhost:3000

# Building
cp .nais/envs/.env.dev .env.production
pnpm run build

# E2E Testing
pnpm run build:e2e
pnpm exec playwright install
pnpm run play
```

Trust these instructions. Only search for additional information if instructions are incomplete or found to be incorrect.
