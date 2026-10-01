# Contributing

Thank you for helping with Widgetify. This is the short version. The rules for each part of the code are in the README of that folder; start from [README.md](../README.md).

## Tools

- [Bun](https://bun.sh) and Node.js
- Chrome and Firefox, to try the extension
- Biome, which is installed with the project

API documentation is in [Api-doc.md](./Api-doc.md).

## Getting started

```bash
git clone https://github.com/widgetify-app/widgetify-extension.git
cd widgetify-extension
bun install
bun dev
```

Open a new tab in the browser that starts. The first one may be blank.

## How to contribute

1. Branch from `dev`. Never work on `main`.
2. Name the branch `<type>/<what-it-does>`, in lowercase with hyphens. The type is one of `feat`, `fix`, `refactor`, `perf`, `docs`, `test` or `chore`. Examples: `fix/calendar-date-selection`, `feat/network-widget`.
3. Make one change per branch. Keep it small and about one topic.
4. Run `npm run check`. It formats the code, type checks, lints, runs the tests and builds.
5. Try the change by hand in the browser and say what you checked.
6. Commit with a short title: `type(scope): what changed`. Add up to three lines of explanation when the reason is not obvious.
7. Open a pull request into `dev` that explains the problem, the cause and the fix.

## Code style

- Biome formats the code. `npm run format` does it for you; `npm run lint` must report nothing.
- No comments in the code. Name things so they explain themselves.
- Text the user sees is Persian, right to left, and friendly.
- Build screens from `src/components/ui` and the theme tokens, with semantic HTML.
- Support Chrome 109 and Firefox 115.

## Questions

Open an issue on GitHub.
