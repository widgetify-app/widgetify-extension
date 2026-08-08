# Build Instructions for Widgetify Extension

## Environment Setup

This extension is built exclusively via Docker, which pins the exact toolchain used for our releases:
- Node.js 24.2.0
- npm 11.3.0

You do not need Node.js, npm, or any dependencies installed on your host machine -- only Docker.

## Prerequisites

- Docker Engine
- Docker Compose (v2, i.e. the `docker compose` command)

## Steps

1. Extract the source code to a directory.
2. Navigate to the project directory:
```bash
cd widgetify-extension
```
3. Build:
```bash
docker compose up --build
```

## After the build finishes

- The built Firefox extension will appear on your local machine in the `local_output` folder (synced via a Docker volume from the container's `.output` directory).
- The zipped extension and matching source archive will be at:
  - `local_output/widgetify-webapp-<version>-firefox.zip`
  - `local_output/widgetify-webapp-<version>-sources.zip`

## Verifying a reproducible build

Because this build relies on the committed `package-lock.json` and pinned Docker base image, running it twice from the same unmodified source should produce byte-identical output. To verify:
```bash
docker compose up --build
mv local_output/firefox-mv2 /tmp/build1
docker compose up --build
diff -rq /tmp/build1 local_output/firefox-mv2
```
No output from `diff` means the build is reproducible.

## Notes

- Always build from a clean, unmodified copy of the source.
- Do not modify source files, `package.json`, or `package-lock.json` before building.
- Do not run `npm install` or `npm update` outside the container -- the lockfile must be installed as-is via `npm ci`, which happens automatically inside the Docker build.
- If you have questions or issues, contact the extension developer.