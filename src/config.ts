export const DEFAULT_STORYBOOK_URL = 'http://localhost:6006';

export function normalizeUrl(raw: string): string {
  return raw.replace(/\/+$/, '');
}

export function buildCspOrigins(baseUrl: string): string[] {
  const parsed = new URL(baseUrl);
  const basePort = parseInt(parsed.port, 10) || (parsed.protocol === 'https:' ? 443 : 80);

  return Array.from({ length: 10 }, (_, i) =>
    `${parsed.protocol}//${parsed.hostname}:${basePort + i}`,
  );
}

export interface AppConfig {
  storybookUrl: string;
  cspOrigins: string[];
  debug: boolean;
}

export function buildConfig(url?: string, debug?: string): AppConfig {
  const storybookUrl = normalizeUrl(url || DEFAULT_STORYBOOK_URL);

  try {
    new URL(storybookUrl);
  } catch {
    throw new Error(
      `Invalid STORYBOOK_URL: "${storybookUrl}". Expected a valid URL like "${DEFAULT_STORYBOOK_URL}".`,
    );
  }

  return {
    storybookUrl,
    cspOrigins: buildCspOrigins(storybookUrl),
    debug: debug === 'true' || debug === '1',
  };
}

export const config = buildConfig(process.env.STORYBOOK_URL, process.env.DEBUG);
