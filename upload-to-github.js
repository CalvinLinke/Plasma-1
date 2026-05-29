#!/usr/bin/env node
// GitHub Upload — Plasma Energie Solution
// Verwendet curl intern (kein Node https-Modul)
// Usage: GITHUB_TOKEN=ghp_xxx node upload-to-github.js

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const TOKEN = process.env.GITHUB_TOKEN;
if (!TOKEN) {
  console.error('Fehler: GITHUB_TOKEN nicht gesetzt');
  console.error('Verwendung: GITHUB_TOKEN=ghp_... node upload-to-github.js');
  process.exit(1);
}

const REPO_NAME = 'plasma-energie-solution';
const REPO_DESC = 'Plasma Energie Solution – Website';
const PROJECT_DIR = path.dirname(__filename);
const SKIP_DIRS = new Set(['node_modules', '.next', '.git']);
const SKIP_FILES = new Set(['upload-to-github.js', 'upload-to-github.sh', '.env.local', '.env', '.DS_Store']);

function curlAPI(method, urlPath, body) {
  let cmd = `curl -s -X ${method} -H "Authorization: token ${TOKEN}" -H "Accept: application/vnd.github.v3+json" -H "Content-Type: application/json"`;
  if (body) {
    const escaped = JSON.stringify(body).replace(/'/g, "'\\''");
    cmd += ` -d '${escaped}'`;
  }
  cmd += ` "https://api.github.com${urlPath}"`;
  try {
    const out = execSync(cmd, { encoding: 'utf8', timeout: 30000 });
    return JSON.parse(out);
  } catch (e) {
    return null;
  }
}

function curlStatus(method, urlPath, body) {
  let cmd = `curl -s -o /dev/null -w "%{http_code}" -X ${method} -H "Authorization: token ${TOKEN}" -H "Accept: application/vnd.github.v3+json" -H "Content-Type: application/json"`;
  if (body) {
    const escaped = JSON.stringify(body).replace(/'/g, "'\\''");
    cmd += ` -d '${escaped}'`;
  }
  cmd += ` "https://api.github.com${urlPath}"`;
  try {
    return execSync(cmd, { encoding: 'utf8', timeout: 30000 }).trim();
  } catch {
    return '0';
  }
}

function collectFiles(dir) {
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SKIP_FILES.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!SKIP_DIRS.has(entry.name)) files.push(...collectFiles(full));
    } else {
      files.push(full);
    }
  }
  return files;
}

async function main() {
  // 1. Token prüfen
  console.log('GitHub-Token wird geprüft...');
  const user = curlAPI('GET', '/user');
  if (!user || !user.login) {
    console.error('Fehler: Ungültiger Token');
    process.exit(1);
  }
  const username = user.login;
  console.log(`Eingeloggt als: ${username}\n`);

  // 2. Repository erstellen falls nötig
  console.log(`Prüfe Repository "${REPO_NAME}"...`);
  const repoStatus = curlStatus('GET', `/repos/${username}/${REPO_NAME}`);
  if (repoStatus === '404') {
    console.log('Nicht gefunden — wird erstellt...');
    const created = curlAPI('POST', '/user/repos', {
      name: REPO_NAME,
      description: REPO_DESC,
      private: false,
      auto_init: false,
    });
    if (created && created.html_url) {
      console.log(`Repository erstellt: ${created.html_url}`);
      execSync('sleep 1');
    } else {
      console.error('Fehler beim Erstellen:', JSON.stringify(created));
      process.exit(1);
    }
  } else {
    console.log('Repository vorhanden — Dateien werden synchronisiert.');
  }
  console.log('');

  // 3. .gitignore
  const gitignoreContent = Buffer.from('.env.local\n.env\nnode_modules/\n.next/\n.DS_Store\n*.log\n').toString('base64');
  const giExisting = curlAPI('GET', `/repos/${username}/${REPO_NAME}/contents/.gitignore`);
  const giSha = giExisting && giExisting.sha ? giExisting.sha : null;
  curlStatus('PUT', `/repos/${username}/${REPO_NAME}/contents/.gitignore`, {
    message: giSha ? 'Update .gitignore' : 'Add .gitignore',
    content: gitignoreContent,
    ...(giSha ? { sha: giSha } : {}),
  });
  console.log('  + .gitignore');

  // 4. Alle Dateien
  const files = collectFiles(PROJECT_DIR);
  console.log(`\n${files.length} Dateien werden hochgeladen...\n`);

  let created = 0, updated = 0, failed = 0;

  for (const filePath of files) {
    const relPath = filePath.slice(PROJECT_DIR.length + 1);
    const encodedPath = relPath.split('/').map(s => encodeURIComponent(s)).join('/');

    let content;
    try {
      content = fs.readFileSync(filePath).toString('base64');
    } catch {
      console.log(`  ✗ ${relPath} — Lesefehler`);
      failed++;
      continue;
    }

    const existing = curlAPI('GET', `/repos/${username}/${REPO_NAME}/contents/${encodedPath}`);
    const sha = existing && existing.sha ? existing.sha : null;

    const status = curlStatus('PUT', `/repos/${username}/${REPO_NAME}/contents/${encodedPath}`, {
      message: sha ? `Update ${relPath}` : `Add ${relPath}`,
      content,
      ...(sha ? { sha } : {}),
    });

    if (status === '201') {
      console.log(`  + ${relPath}`);
      created++;
    } else if (status === '200') {
      console.log(`  ↑ ${relPath}`);
      updated++;
    } else {
      console.log(`  ✗ ${relPath} (HTTP ${status})`);
      failed++;
    }
  }

  console.log(`\n${'─'.repeat(55)}`);
  console.log(`${created} erstellt, ${updated} aktualisiert, ${failed} fehlgeschlagen`);
  console.log(`\nRepository: https://github.com/${username}/${REPO_NAME}`);
  console.log('\nNächster Schritt — Vercel Deployment:');
  console.log('1. Öffne https://vercel.com/new');
  console.log(`2. Wähle "Import Git Repository"`);
  console.log(`3. Wähle "${REPO_NAME}"`);
  console.log('4. Framework: Next.js (automatisch erkannt)');
  console.log('5. Klicke "Deploy"\n');
}

main();
