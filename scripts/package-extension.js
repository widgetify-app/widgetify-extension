#!/usr/bin/env node
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';


const browser = process.argv[2] || 'chrome';


const packageJson = JSON.parse(fs.readFileSync('./src/manifest.json', 'utf8'));
const version = packageJson.version;


const zipFilename = `widgetify-${version}-${browser}.zip`;


if (!fs.existsSync('./packages')) {
    fs.mkdirSync('./packages', { recursive: true });
}


console.log(`Building ${browser} extension...`);
execSync(`npm run build:${browser}`, { stdio: 'inherit' });


console.log(`Packaging ${browser} extension as ${zipFilename}...`);
execSync(
    `web-ext build --source-dir=dist --artifacts-dir=packages --filename=${zipFilename} --overwrite-dest`,
    { stdio: 'inherit' }
);

console.log(`Successfully packaged ${zipFilename}`);