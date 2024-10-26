import { execSync } from 'child_process';
import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

// Define the changelog structure
interface Changelog {
    added: string[];
    modified: string[];
    deleted: string[];
}

const getPackageVersion = (): string => {
    const packageJsonPath = join(__dirname, '../../package.json');
    const packageJson = JSON.parse(execSync(`cat ${packageJsonPath}`, { encoding: 'utf-8' }));
    return packageJson.version;
};

const generateChangelog = () => {
    try {
        // Get the last merged commit
        const baseCommit = process.argv[2] || 'HEAD~1'; // Default to the last commit if no base commit is provided
        const headCommit = process.argv[3] || 'HEAD';

        // Get the list of changes
        const diffOutput = execSync(`git diff --name-status ${baseCommit} ${headCommit}`, { encoding: 'utf-8' });
        const changes = diffOutput.split('\n').filter(line => line.trim() !== '');
        const changelog: Changelog = {
            added: [],
            modified: [],
            deleted: [],
        };

        changes.forEach(change => {
            const [status, file] = change.split('\t');
            switch (status) {
                case 'A':
                    changelog.added.push(file);
                    break;
                case 'M':
                    changelog.modified.push(file);
                    break;
                case 'D':
                    changelog.deleted.push(file);
                    break;
            }
        });

        // Get the commit messages for the specified range
        const commitMessages = execSync(`git log --oneline ${baseCommit}..${headCommit}`, { encoding: 'utf-8' }).trim();

        // Get the current version from package.json
        const version = getPackageVersion();

        // Prepare the changelog content
        let changelogContent = `# Changelog\n\n`;
        changelogContent += `Version: **${version}**\n\n`;
        changelogContent += `All notable changes to this project will be documented in this file.\n\n`;
        changelogContent += `## [Unreleased]\n\n`;

        // Commit messages section
        if (commitMessages) {
            changelogContent += `### ✍️ Commit Messages\n\n`;
            commitMessages.split('\n').forEach(message => {
                changelogContent += `* ${message}\n`;
            });
            changelogContent += '\n';
        }

        // Added section
        if (changelog.added.length > 0) {
            changelogContent += "### ✨ Added\n\n";
            changelog.added.forEach(file => {
                changelogContent += `* \`${file}\` - This file introduces new functionality or features to enhance the user experience.\n`;
            });
            changelogContent += '\n';
        }

        // Modified section
        if (changelog.modified.length > 0) {
            changelogContent += "### 🛠️ Modified\n\n";
            changelog.modified.forEach(file => {
                changelogContent += `* \`${file}\` - This file has been updated to improve functionality or fix issues, ensuring a better performance.\n`;
            });
            changelogContent += '\n';
        }

        // Deleted section
        if (changelog.deleted.length > 0) {
            changelogContent += "### ❌ Deleted\n\n";
            changelog.deleted.forEach(file => {
                changelogContent += `* \`${file}\` - This file has been removed as it was no longer necessary or has been replaced by better alternatives.\n`;
            });
            changelogContent += '\n';
        }

        // Ensure the changes directory exists
        const changesDir = join(__dirname, '../../changes');
        mkdirSync(changesDir, { recursive: true });

        // Write the changelog to a file with the version in the name
        writeFileSync(join(changesDir, `CHANGELOG-${version}.md`), changelogContent.trim() + '\n\n', 'utf-8');
        console.log(`CHANGELOG-${version}.md has been updated successfully in the changes directory!`);
    } catch (error) {
        console.error('Error generating changelog:', error);
    }
};

// Execute the function
generateChangelog();