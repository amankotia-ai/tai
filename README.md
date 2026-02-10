# theatre.ai CastID Vault

Frontend web app for `theatre.ai`: an AI rights-management experience where actors protect voice/face/motion assets, manage consent-first licensing, and studios discover and request compliant usage.

## Core product areas

- Public marketing + trust pages (`/`, `/about`, `/castid`, `/licensing`, `/network`, `/press`, `/research`)
- Onboarding + sign-in (`/onboarding`, `/signin`)
- Artist vault and consent controls (`/vault`, `/dashboard/vault`)
- Discovery and casting flows (`/search`, `/casting-calls`, `/studio/:id`)
- Contracts, chat, payments, settings, and profile surfaces

## Tech stack

- React 18 + TypeScript
- Vite 5
- Tailwind CSS + shadcn/ui + Radix UI
- React Router
- TanStack Query
- Vitest + Testing Library

## Local development

Requirements:
- Node.js 18+
- npm

Install and run:

```bash
npm install
npm run dev
```

Build and preview:

```bash
npm run build
npm run preview
```

Quality checks:

```bash
npm run lint
npm run test
```

## Project structure

- `src/pages/` route-level pages (public + dashboard)
- `src/components/` shared UI and layout components
- `src/lib/store.ts` local mock/store state used across feature flows
- `docs/frontend-acceptance-gap-and-user-flows.md` current gap analysis and user-journey acceptance plan

## Status

This repository currently focuses on frontend product flows with mocked/local state for many interactions. It is suitable for UX iteration, stakeholder demos, and acceptance-gap tracking before full backend integration.
