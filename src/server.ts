#!/usr/bin/env node

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { readFileSync } from 'fs';
import { join } from 'path';
import { config } from './config.js';
import { PROJECT_ROOT } from './paths.js';
import { registerPreviewResource } from './resources/preview-resource.js';
import { registerRenderComponentTool } from './tools/render-component.js';

const pkg = JSON.parse(readFileSync(join(PROJECT_ROOT, 'package.json'), 'utf-8')) as { version: string };

const server = new McpServer(
  {
    name: 'storybook-preview',
    version: pkg.version,
  },
  {
    instructions:
      'Renders a Storybook component preview inside the IDE. ' +
      'ALWAYS call render_component after editing any component file that has a corresponding Storybook story — ' +
      'do not wait for the user to ask. This lets the user immediately see the visual result of the change. ' +
      `Storybook URL: ${config.storybookUrl}. ` +
      'Story IDs follow the pattern: title segments lowercased and joined by dashes, ' +
      'double-dash before the story export name (e.g. title "Example/Button" + export "Primary" = "example-button--primary").',
  },
);

registerRenderComponentTool(server);
registerPreviewResource(server);

const transport = new StdioServerTransport();
await server.connect(transport);
