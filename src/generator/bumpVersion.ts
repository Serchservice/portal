import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const packageJsonPath = join(__dirname, '../../package.json');
const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));

const bumpVersion = (type: 'patch' | 'minor' | 'major'): void => {
    const versionParts: string[] = packageJson.version.split('.');
    if (type === 'patch') {
        versionParts[2] = (parseInt(versionParts[2], 10) + 1).toString();
    } else if (type === 'minor') {
        versionParts[1] = (parseInt(versionParts[1], 10) + 1).toString();
        versionParts[2] = '0';
    } else if (type === 'major') {
        versionParts[0] = (parseInt(versionParts[0], 10) + 1).toString();
        versionParts[1] = '0';
        versionParts[2] = '0';
    }

    packageJson.version = versionParts.join('.');
    writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n');
};

const type = process.argv[2] as 'patch' | 'minor' | 'major';
if (!['patch', 'minor', 'major'].includes(type)) {
    console.error('Usage: ts-node bump-version.ts [patch|minor|major]');
    process.exit(1);
}

bumpVersion(type);
console.log(`Version bumped to ${packageJson.version}`);