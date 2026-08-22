# Helpers Package

- Keep helper implementations consistent with existing files in `src/`.
- Each helper must live in its own file and be named `XxxHelper.ts`.
- Each helper must export a class named `XxxHelper`.
- Helper methods must be `static`.
- Keep helper logic pure and free of side effects whenever possible.
- Prefer small, focused methods over large multi-purpose helpers.
- Do not add external dependencies unless there is a clear justification.
- Export every new helper from `src/index.ts`.
- Reuse existing helpers when possible instead of duplicating logic.
- Follow the existing TypeScript style of the package.
- Add or update tests when a helper behavior is added or changed.
