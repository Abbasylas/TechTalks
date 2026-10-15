/* eslint-disable @typescript-eslint/no-require-imports -- Standalone Node repository check. */
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');

const root = path.resolve(__dirname, '..');
const files = [];
function walk(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (['node_modules', '.next', '.git', 'output'].includes(entry.name)) continue;
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(full);
    else files.push(full);
  }
}
walk(root);
const textFiles = files.filter(file => /\.(tsx?|cjs|mjs|json|md|css|txt)$/.test(file));
const patterns = [
  /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,
  /\bAIza[0-9A-Za-z_-]{35}\b/,
  /\bgh[pousr]_[0-9A-Za-z]{30,}\b/,
  /\bsk-(?:proj-)?[0-9A-Za-z_-]{30,}\b/,
  /\bAKIA[0-9A-Z]{16}\b/,
  /(?:api[_-]?key|access[_-]?token|client[_-]?secret|password|authorization)\s*[=:]\s*["'][0-9A-Za-z+/_=-]{12,}["']/i,
];
const matches = textFiles.filter(file => patterns.some(pattern => pattern.test(fs.readFileSync(file, 'utf8'))));
const envFiles = files.filter(file => /^\.env(?:\.|$)/.test(path.basename(file)));
assert.deepEqual(matches, [], 'Potential credential signatures found; inspect locally without printing their values.');
assert.deepEqual(envFiles, [], 'Unexpected environment files.');
const pages = files.filter(file => /[\\/]app[\\/].*[\\/]?page\.tsx$/.test(file) || file === path.join(root, 'app/page.tsx'));
assert.deepEqual(pages.map(file => path.relative(root, file)), [path.join('app', 'page.tsx')]);
const clientComponents = files.filter(file => /\.tsx$/.test(file) && /^['"]use client['"]/m.test(fs.readFileSync(file, 'utf8')));
assert.deepEqual(clientComponents.map(file => path.relative(root, file)), [path.join('components', 'training-plan.tsx')]);
const scripts = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8')).scripts;
assert.equal(scripts.dev, 'next dev --webpack');
assert.equal(scripts.build, 'next build --webpack');
const report = {
  credentialScan: { textFilesScanned: textFiles.length, potentialSecretMatches: 0, environmentFiles: 0, limitations: 'Signature-based worktree scan plus source inspection; not a guarantee against every credential format or past Git history.' },
  scope: { applicationRoutes: ['/'], clientComponents: ['components/training-plan.tsx'], database: false, auth: false, extraActions: false },
  scripts,
};
const output = path.join(root, 'output/playwright');
fs.mkdirSync(output, { recursive: true });
fs.writeFileSync(path.join(output, 'mvp-repository-check.json'), JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify(report, null, 2));
