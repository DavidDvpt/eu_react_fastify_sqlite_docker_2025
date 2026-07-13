# AGENTS.md

## General rules

- Always read existing code before creating new abstractions
- Prefer consistency with the existing codebase over “best practices”
- Do not introduce new dependencies without justification
- Never modify generated files

## Architecture

- Frontend uses React + Radix-ui
- Data fetching must use React Query
- Forms must use React Hook Form + Zod
- API communication must go through dedicated hooks stored in `@/shared/hooks` (no direct fetch in components)

## Components

- Reuse components from `@/components/ui` or `@/shared/components/*` before creating new ones
- Keep components small and focused
- Business logic must not live inside UI components
- Only 1 component per file
- Extract variants in a `<file>.variant.ts` file
- Check in `@/shared/tools/*` before extract helpers in a `utils.ts` file

## Styling

- Use Tailwind only
- Do not use inline styles
- Use design tokens (colors, spacing) from the theme

## Backend

- Use Prisma for all database access
- Do not write raw SQL unless strictly necessary
- Validate all inputs with Zod
- Never create, edit, or delete files under `back-end/prisma/migrations` manually.
- Always use the Prisma CLI to generate migrations automatically.
- If a schema change requires a migration, generate it with the appropriate Prisma command instead of touching migration files directly.

## Tests

- Create tests on each new function or component

## Naming

- Use clear and explicit names
- Avoid abbreviations
- Use English for code and comments

## Validation steps (MANDATORY)

After any change:

1. Run `npm lint`
2. Run `npm test`
3. Run `npm build` if relevant

## Definition of done

- No TypeScript errors
- Lint passes
- Tests pass
- No unused code
