/**
 * Nudge the agent to read files fully after consecutive search operations.
 * Searching with rg/grep gives snippets — but snippets miss context.
 */
import type { ExtensionAPI } from "@mariozechner/pi-coding-agent";

const SEARCH_PATTERN = /\b(rg|grep|egrep|fgrep|zgrep|bzgrep|xzgrep|ag|ack|pt|sift|ucg)\b/;

export default function (pi: ExtensionAPI) {
	let consecutiveSearches = 0;
	let shouldFire = false;

	pi.on("tool_result", async (event) => {
		let isSearch = false;

		if (event.toolName === "bash") {
			const cmd = (event.input as any)?.command ?? "";
			isSearch = SEARCH_PATTERN.test(cmd);
		}
		if (event.toolName === "grep" || event.toolName === "find" || event.toolName === "ls") {
			isSearch = true;
		}

		if (isSearch) {
			consecutiveSearches++;
			if (consecutiveSearches >= 2) {
				shouldFire = true;
				consecutiveSearches = 0;
			}
		} else {
			consecutiveSearches = 0;
		}
	});

	return {
		on: "tool_execution_end",
		when: () => {
			if (shouldFire) {
				shouldFire = false;
				return true;
			}
			return false;
		},
		message: "You've been using grep/search commands to read file contents. " +
			"Grepping and searching is fine for *locating* files, but once you've found them, " +
			"read the full files start to finish before writing code based on them. " +
			"Partial reads (grep, head, offset/limit) miss imports, types, control flow, helpers, " +
			"and the overall shape — all of which matter for writing correct code.",
		cooldown: 1,
	};
}
