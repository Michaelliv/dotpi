/**
 * Nudge the agent to read files fully after consecutive search operations.
 * Searching with rg/grep gives snippets — but snippets miss context.
 */
import type { ExtensionAPI } from "@mariozechner/pi-coding-agent";

const SEARCH_PATTERN = /\b(rg|grep|egrep|fgrep|zgrep|bzgrep|xzgrep|ag|ack|pt|sift|ucg)\b/;

export default function (pi: ExtensionAPI) {
	let searchCount = 0;

	pi.on("tool_result", async (event) => {
		if (event.toolName === "bash") {
			const cmd = (event.input as any)?.command ?? "";
			if (SEARCH_PATTERN.test(cmd)) {
				searchCount++;
			}
		}
		if (event.toolName === "grep") {
			searchCount++;
		}
	});

	return {
		on: "tool_execution_end",
		when: () => searchCount >= 2 && searchCount % 2 === 0,
		message: "You've been searching with grep/rg. Search snippets lose context. Read the relevant files FULLY — start to finish — before drawing conclusions or making changes.",
		cooldown: 1,
	};
}
