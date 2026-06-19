import { existsSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const lockedEnvKeys = new Set(Object.keys(process.env));

loadEnvFiles();

function loadEnvFiles(): void {
  const cwd = process.cwd();
  const appRoot = dirname(dirname(fileURLToPath(import.meta.url)));
  const workspaceRoot = findWorkspaceRoot(cwd);
  const files = unique([
    join(workspaceRoot, '.env'),
    join(workspaceRoot, '.env.local'),
    join(appRoot, '.env'),
    join(appRoot, '.env.local'),
    join(cwd, '.env'),
    join(cwd, '.env.local'),
  ]);

  files.forEach(loadEnvFile);
}

function loadEnvFile(filePath: string): void {
  if (!existsSync(filePath)) {
    return;
  }

  const content = readFileSync(filePath, 'utf8');
  parseEnv(content).forEach(([key, value]) => {
    if (!lockedEnvKeys.has(key)) {
      process.env[key] = value;
    }
  });
}

function parseEnv(content: string): Array<[string, string]> {
  const entries: Array<[string, string]> = [];

  content.split(/\r?\n/).forEach((line) => {
    const parsed = parseEnvLine(line);
    if (parsed) entries.push(parsed);
  });

  return entries;
}

function parseEnvLine(line: string): [string, string] | null {
  const normalized = line.trim();
  if (!normalized || normalized.startsWith('#')) {
    return null;
  }

  const withoutExport = normalized.startsWith('export ') ? normalized.slice('export '.length).trimStart() : normalized;
  const equalsIndex = withoutExport.indexOf('=');
  if (equalsIndex <= 0) {
    return null;
  }

  const key = withoutExport.slice(0, equalsIndex).trim();
  if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(key)) {
    return null;
  }

  const rawValue = withoutExport.slice(equalsIndex + 1).trim();
  return [key, parseEnvValue(rawValue)];
}

function parseEnvValue(value: string): string {
  if (value.startsWith('"') && value.endsWith('"')) {
    return value
      .slice(1, -1)
      .replace(/\\n/g, '\n')
      .replace(/\\r/g, '\r')
      .replace(/\\t/g, '\t')
      .replace(/\\"/g, '"')
      .replace(/\\\\/g, '\\');
  }

  if (value.startsWith("'") && value.endsWith("'")) {
    return value.slice(1, -1);
  }

  return value.replace(/\s+#.*$/, '').trim();
}

function findWorkspaceRoot(start: string): string {
  let current = resolve(start);

  while (true) {
    if (existsSync(join(current, 'pnpm-workspace.yaml'))) {
      return current;
    }

    const parent = dirname(current);
    if (parent === current) {
      return start;
    }

    current = parent;
  }
}

function unique(values: string[]): string[] {
  return Array.from(new Set(values));
}
