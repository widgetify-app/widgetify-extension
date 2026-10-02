# ![logo](./public/icons/icon32.png) Widgetify

Widgetify is a browser extension that fills your new tab with useful widgets: weather, currency rates, calendar, to-do list, notes, search, bookmarks and more.

Official website: [widgetify.ir](https://widgetify.ir)

## Supported browsers

| Browser | Minimum |
|---|---|
| Chrome | 109 |
| Firefox | 115 ESR |

These are the last versions Windows 7 can run, and some companies still use it. Do not add code that needs anything newer. The full rules are in [entrypoints/README.md](entrypoints/README.md).

## Run it

You need [Bun](https://bun.sh) and Node.js.

```bash
bun install
```

| Command | Does |
|---|---|
| `bun dev` | Starts the extension in Chrome with live reload |
| `bun dev:firefox` | Same, in Firefox |
| `npm run build` | Chrome build into `.output/chrome-mv3` |
| `npm run build:firefox` | Firefox build into `.output/firefox-mv2` |
| `npm run format` | Formats the code with Biome |
| `npm run compile` | Type check |
| `npm run lint` | Biome check, must report nothing |
| `npm test` | Tests |
| `npm run check` | Format, type check, lint, tests and build together |
| `npm run check:commit` | Checks that the last commit compiles on its own and that its message is clean |

After `bun dev`, open a new tab. The first one may be blank.

For formatting, be sure to use only `npm run lint` and `npm run format`.

## How the code is organised

Every folder with its own rules has a README that explains only that part.

| Part | Guide |
|---|---|
| The whole `src` layout, names and imports | [src/README.md](src/README.md) |
| Buttons, modals and the other primitives | [src/components/ui/README.md](src/components/ui/README.md) |
| Colours, themes and stylesheets | [src/styles/README.md](src/styles/README.md) |
| Storage, events, animation | [src/common/README.md](src/common/README.md) |
| Server requests | [src/services/README.md](src/services/README.md) |
| Icons | [src/icons/README.md](src/icons/README.md) |
| Features | [src/features/README.md](src/features/README.md) |
| Widgets | [src/features/widgets/README.md](src/features/widgets/README.md) |
| Manifest, build and browsers | [entrypoints/README.md](entrypoints/README.md) |

Working with an AI agent? It follows [AGENTS.md](AGENTS.md).

## Contributing

Read the [contribution guide](.github/CONTRIBUTING.md).

## Analytics and privacy

Widgetify uses Google Analytics 4 to collect anonymous statistics and improve the experience.

**What is collected**

- Page views: how long extension pages are open.
- Features: how widgets are used, such as changing the background, using the weather widget or creating a note. The note's content is never sent.
- Errors: failures that help us fix the extension.

**Turning it off.** Choose "Disable Analytics" in the extension's general settings.

**Privacy.** The data never includes personal information or the content of your notes. It is used only to improve Widgetify.

## Feedback

Share ideas and problems through [GitHub issues](https://github.com/widgetify-app/widgetify-extension/issues).

## License

See [LICENSE](LICENSE).
