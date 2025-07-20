# Build Instructions for Widgetify Extension

## Environment Setup
This extension must be built with the following environment:
- Node.js version 24.2.0
- npm version 11.3.0
- Ubuntu 24.04 LTS (or Docker, see below)


## Option 1: Docker Build (we highly recommend this method)

We've provided a `Dockerfile` and `docker-compose.yml` that set up the exact build environment and copy built files to your local machine automatically.

## Steps
1. Install Docker and Docker Compose.
2. Navigate to the project directory.
3. Build and run:
```bash
docker compose up --build
```

### After the build finishes:
- The built extension will appear directly in your local machine inside the `local_output` folder.
- This folder is synced via Docker volume.

## Notes

- Always build from a clean environment.
- Do not modify source files or update dependencies before building.
- Output for Firefox build will be in `.output` (inside container) or `local_output` (on your local machine).
- If you have questions or issues, contact the extension developer


## Option 2: Direct Build

1. Clone or extract the source code to a directory
2. Navigate to the project directory
```bash
cd widgetify-extension
```

3. Install dependencies with exact versions specified in package.json
```bash
npm ci
```
**Important**: Use `npm ci` instead of `npm install` to ensure exact versions are installed according to package-lock.json

4. Build the extension for Firefox
```bash
npm run build:firefox:clean
```

5. The built extension will be available in the `dist` directory

