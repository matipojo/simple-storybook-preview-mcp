# Simple Storybook Preview MCP

See your components render live inside the IDE as the AI edits them. No switching windows.

**[Documentation & Live Demo](https://matipojo.github.io/simple-storybook-preview-mcp/)**

![MCP Apps](https://img.shields.io/badge/MCP_Apps-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-333?logo=typescript) ![Node 18+](https://img.shields.io/badge/Node-18%2B-green)

## Quick Start

Add to `.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "storybook-preview": {
      "command": "npx",
      "args": ["-y", "simple-storybook-preview-mcp"],
      "env": {
        "STORYBOOK_URL": "http://localhost:6006"
      }
    }
  }
}
```

Start your Storybook dev server (`npm run storybook`), then ask the AI to edit a component — the preview appears automatically.

## Configuration

| Env Variable | Default | Description |
|---|---|---|
| `STORYBOOK_URL` | `http://localhost:6006` | Base URL of your running Storybook dev server |
| `DEBUG` | `false` | Set to `true` or `1` to show a debug log panel |

## How Story IDs Work

The AI derives story IDs from your Storybook file structure:

```
title segments lowercased, joined by dashes + double-dash + story export name

"Components/Button" + "Primary" → components-button--primary
"Forms/Input" + "WithLabel"     → forms-input--withlabel
```

## Requirements

- **Node.js 18+**
- **Storybook 7+** dev server running
- IDE with **MCP Apps** support (e.g. Cursor)

Works with any framework Storybook supports (React, Vue, Angular, Svelte, etc.).

## Links

- [Documentation](https://matipojo.github.io/simple-storybook-preview-mcp/)
- [GitHub](https://github.com/matipojo/simple-storybook-preview-mcp)

## License

MIT
