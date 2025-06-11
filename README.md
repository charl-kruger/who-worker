# Who Counter MCP Server (Authless)

This MCP server tracks how many times a user says 'who' in their session and provides MCP tools to register and retrieve the count.

## Get Started

[![Deploy to Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/your-repo-here)

Deploys to:

    https://remote-mcp-server-who-count.<your-account>.workers.dev/sse

Or start locally:

```bash
npm create cloudflare@latest -- my-who-counter --template=cloudflare/ai/demos/remote-mcp-authless
```

## Tools

### register_who_count
- **Description:** Increment and register the count if input contains the word 'who'.
- **Input:** `{ message: string }`
- **Returns:** Count after processing message.

### get_who_count
- **Description:** Returns the number of times the user has said 'who' in the session.

## Testing

### Register 'who' (example with curl)

```
curl -X POST \
  https://remote-mcp-server-who-count.<your-account>.workers.dev/mcp \
  --header 'Content-Type: application/json' \
  --data '{"toolCall": "register_who_count", "args": {"message": "who are you? Who? WHO."}}'
```

### Get current who count

```
curl -X POST \
  https://remote-mcp-server-who-count.<your-account>.workers.dev/mcp \
  --header 'Content-Type: application/json' \
  --data '{"toolCall": "get_who_count", "args": {}}'
```

## Notes
- The who count is per session (per MCP agent instance).
- To reset, restart the session or create a new agent instance.
- No authentication required.

See [Cloudflare documentation](https://developers.cloudflare.com/agents/model-context-protocol/tools/) for MCP integration tips.

---

For local proxy testing or connection with Claude Desktop and other MCP clients, see `readme.md` in your generated project for further details.

