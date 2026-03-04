import { registerAppTool } from '@modelcontextprotocol/ext-apps/server';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { config } from '../config.js';
import { RESOURCE_URI } from '../constants.js';

const storyMetadataSchema = z.object({
  id: z.string().optional(),
  title: z.string().optional(),
  name: z.string().optional(),
  componentPath: z.string().optional(),
  importPath: z.string().optional(),
  exportName: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

export type StoryMetadata = z.infer<typeof storyMetadataSchema>;

const outputSchema = {
  storyId: z.string(),
  url: z.string(),
  theme: z.enum(['light', 'dark']).optional(),
  story: storyMetadataSchema.optional(),
};

export function buildStoryUrl(baseUrl: string, storyId: string): string {
  return `${baseUrl}/iframe.html?id=${encodeURIComponent(storyId)}&viewMode=story`;
}

export function extractStoryMetadata(
  index: Record<string, Record<string, StoryMetadata>>,
  storyId: string,
): StoryMetadata | undefined {
  const entries = index.entries || index.stories || {};
  const raw = entries[storyId];
  if (!raw) return undefined;

  return {
    id: raw.id,
    title: raw.title,
    name: raw.name,
    componentPath: raw.componentPath,
    importPath: raw.importPath,
    exportName: raw.exportName,
    tags: raw.tags,
  };
}

async function fetchStoryMetadata(baseUrl: string, storyId: string): Promise<StoryMetadata | undefined> {
  try {
    const res = await fetch(`${baseUrl}/index.json`);
    if (!res.ok) return undefined;

    const index = await res.json() as Record<string, Record<string, StoryMetadata>>;
    return extractStoryMetadata(index, storyId);
  } catch {
    return undefined;
  }
}

export function registerRenderComponentTool(server: McpServer): void {
  registerAppTool(
    server,
    'render_component',
    {
      title: 'Render Component',
      description:
        'Renders a Storybook story in an inline preview panel. Use after editing a component file to show the updated result. ' +
        'The storyId follows Storybook convention: title segments joined by dashes, double-dash before story name ' +
        '(e.g. "example-button--primary" for title "Example/Button", export "Primary").',
      inputSchema: {
        storyId: z
          .string()
          .describe(
            'Storybook story ID, e.g. "example-button--primary". Derived from the story title and export name: ' +
            'title segments lowercased and joined by dashes, double-dash before the story export name lowercased.',
          ),
        theme: z
          .enum(['light', 'dark'])
          .optional()
          .describe('Preview color scheme. Defaults to the user\'s OS preference when omitted.'),
      },
      outputSchema,
      _meta: {
        ui: {
          resourceUri: RESOURCE_URI,
          csp: {
            frameDomains: config.cspOrigins,
            resourceDomains: config.cspOrigins,
            connectDomains: config.cspOrigins,
          },
        },
      },
    },
    async ({ storyId, theme }) => {
      const baseUrl = config.storybookUrl;
      const url = buildStoryUrl(baseUrl, storyId);
      const story = await fetchStoryMetadata(baseUrl, storyId);

      return {
        content: [{ type: 'text', text: `Rendering story "${storyId}" from ${baseUrl}` }],
        structuredContent: { storyId, url, theme, story },
      };
    },
  );
}
