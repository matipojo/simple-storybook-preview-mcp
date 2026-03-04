import { dirname, join } from 'path';
import { existsSync } from 'fs';
import { fileURLToPath } from 'url';

function findProjectRoot(startDir: string): string {
  let dir = startDir;
  while (dir !== dirname(dir)) {
    if (existsSync(join(dir, 'package.json'))) return dir;
    dir = dirname(dir);
  }
  return startDir;
}

const __dirname = dirname(fileURLToPath(import.meta.url));

export const PROJECT_ROOT = findProjectRoot(__dirname);
