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
		if (event.toolName === "grep") {
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
		message: "You've been searching with grep/rg. Search snippets lose context. Read the relevant files FULLY — start to finish — before drawing conclusions or making changes.",
		cooldown: 1,
	};
}
