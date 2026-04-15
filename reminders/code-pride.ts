/**
 * After writing code, nudge the agent to re-read and self-review.
 */
import type { ExtensionAPI } from "@mariozechner/pi-coding-agent";

const CODE_EXTENSIONS = /\.(ts|tsx|js|jsx|mjs|cjs|py|rs|go|rb|java|kt|swift|c|cpp|h|hpp|cs|lua|zig|sh|bash|zsh|vue|svelte|astro|css|scss|html)$/;

export default function (pi: ExtensionAPI) {
	let wroteCode = false;

	pi.on("tool_result", async (event) => {
		if (event.toolName === "write" || event.toolName === "Write" || event.toolName === "edit" || event.toolName === "Edit") {
			const path = (event.input as any)?.path ?? "";
			if (CODE_EXTENSIONS.test(path)) {
				wroteCode = true;
			}
		}
	});

	return {
		on: "agent_end" as const,
		when: () => {
			if (wroteCode) {
				wroteCode = false;
				return true;
			}
			return false;
		},
		message:
			"You wrote code this turn. Read the code you implemented fully — is it clean, pristine, and will it make the user proud?",
		cooldown: 0,
	};
}
