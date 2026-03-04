import { registerAppResource, RESOURCE_MIME_TYPE } from '@modelcontextprotocol/ext-apps/server';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { config } from '../config.js';
import { RESOURCE_URI } from '../constants.js';
import { PROJECT_ROOT } from '../paths.js';

export function inlinePlaceholder(html: string, placeholder: string, content: string): string {
  const idx = html.indexOf(placeholder);
  if (idx === -1) return html;
  return html.substring(0, idx) + content + html.substring(idx + placeholder.length);
}

async function buildHtml(): Promise<string> {
  const staticDir = join(PROJECT_ROOT, 'static');

  const fileReads = [
    readFile(join(staticDir, 'storybook.html'), 'utf-8'),
    readFile(join(staticDir, 'storybook.css'), 'utf-8'),
    readFile(join(PROJECT_ROOT, 'dist', 'mcp-app-bundle.js'), 'utf-8'),
    config.debug
      ? readFile(join(staticDir, 'debug.css'), 'utf-8')
      : Promise.resolve(''),
  ] as const;

  const [template, styles, appBundle, debugStyles] = await Promise.all(fileReads);

  let html = inlinePlaceholder(template, '%%MCP_APP_STYLES%%', styles);
  html = inlinePlaceholder(html, '%%MCP_DEBUG_STYLES%%', debugStyles);
  html = inlinePlaceholder(html, '%%MCP_APP_BUNDLE%%', appBundle);
  html = inlinePlaceholder(html, '%%MCP_DEBUG%%', String(config.debug));
  return html;
}

const htmlPromise = buildHtml();

export function registerPreviewResource(server: McpServer): void {
  registerAppResource(
    server,
    RESOURCE_URI,
    RESOURCE_URI,
    { mimeType: RESOURCE_MIME_TYPE },
    async () => {
      const html = await htmlPromise;
      return {
        contents: [{
          uri: RESOURCE_URI,
          mimeType: RESOURCE_MIME_TYPE,
          text: html,
          _meta: {
            ui: {
              csp: {
                frameDomains: config.cspOrigins,
                resourceDomains: config.cspOrigins,
                connectDomains: config.cspOrigins,
              },
            },
          },
        }],
      };
    },
  );
}
