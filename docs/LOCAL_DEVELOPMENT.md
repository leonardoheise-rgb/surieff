# Local Development

## Prerequisites

- Node.js 24 or newer
- npm 11 or newer

## Setup

1. Run `npm install` from the repository root.
2. Copy `.env.example` to `.env` if you want to override the default mocked device values.
3. Run `npm run dev`.

## Quality Checks

- `npm run test`
- `npm run lint`
- `npm run build`

## Sprint 0 Scope

This foundation includes:

- A React and TypeScript frontend workspace
- Routing for dashboard, onboarding, alarms, and settings
- A mocked device client abstraction for local-first development
- Baseline unit tests and linting

## Device Strategy

The application is intentionally decoupled from the real ESP32 during Sprint 0. The mocked device client simulates the most important state required for future onboarding and alarm features, which lets the UI and domain layers evolve before the hardware is available.

## Mock Connectivity Scenarios

You can test onboarding states without hardware by using different host values:

- `solaris.local`: successful online connection
- `recover.local` or `slow.local`: reachable but degraded connection
- `offline.local` or `fail.local`: unreachable device
