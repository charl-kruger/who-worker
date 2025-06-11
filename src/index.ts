// src/index.ts
import { McpAgent } from "agents/mcp";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

// This MCP server tracks a per-session count of how many times a user has said 'who' (case insensitive)
export class MyMCP extends McpAgent {
	server = new McpServer({
		name: "Who Counter",
		version: "1.0.0",
	});

	// Initial state: a count property
	initialState = { whoCount: 0 };

	async init() {
		// Tool: register_who_count
		// Increments the 'who' count for this session if input contains 'who'
		this.server.tool(
			"register_who_count",
			"Increment and register the count if the input contains the word 'who'. Returns the new count.",
			{ message: z.string().describe("The user message to analyze for 'who'") },
			async ({ message }) => {
				if (typeof message !== "string") {
					return {
						content: [{ type: "text", text: "Error: message must be a string." }],
					};
				}
				const whoMatches = message.match(/\bwho\b/gi);
				const increment = whoMatches ? whoMatches.length : 0;
				this.setState({ ...this.state, whoCount: this.state.whoCount + increment });
				return {
					content: [
						{
							type: "text",
							text:
								increment > 0
									? `Registered ${increment} occurrence${increment === 1 ? "" : "s"} of 'who'. Total count: ${this.state.whoCount}.`
								: `No 'who' detected in the message. Total count: ${this.state.whoCount}`,
						},
					],
				};
			}
		);

		// Tool: get_who_count
		// Returns the count of how many times 'who' was registered
		this.server.tool(
			"get_who_count",
			"Get the number of times the user has said 'who' in this session.",
			{},
			async () => ({
				content: [{ type: "text", text: `Total 'who' count: ${this.state.whoCount}` }],
			})
		);
	}
}

export default {
	fetch(request: Request, env: Env, ctx: ExecutionContext) {
		const url = new URL(request.url);
		if (url.pathname === "/sse" || url.pathname === "/sse/message") {
			return MyMCP.serveSSE("/sse").fetch(request, env, ctx);
		}
		if (url.pathname === "/mcp") {
			return MyMCP.serve("/mcp").fetch(request, env, ctx);
		}
		return new Response("Not found", { status: 404 });
	},
};
