/**
 * After writing code, nudge the agent to re-read and self-review.
 */
import type { ExtensionAPI } from "@mariozechner/pi-coding-agent";

const CODE_EXTENSIONS = /\.(ts|tsx|js|jsx|mjs|cjs|py|rs|go|rb|java|kt|swift|c|cpp|h|hpp|cs|lua|zig|sh|bash|zsh|vue|svelte|astro|css|scss|html)$/;

export default function (pi: ExtensionAPI) {
	const editedPaths = new Set<string>();

	pi.on("tool_result", async (event) => {
		if (event.toolName === "write" || event.toolName === "Write" || event.toolName === "edit" || event.toolName === "Edit") {
			const path = (event.input as any)?.path ?? "";
			if (CODE_EXTENSIONS.test(path)) {
				editedPaths.add(path);
			}
		}
	});

	return {
		on: "agent_end" as const,
		when: () => editedPaths.size > 0,
		message: () => {
			const paths = [...editedPaths].map((p) => `\`${p}\``).join(", ");
			editedPaths.clear();
			return `You edited these files this turn: ${paths}. READ THE ENTIRE FILE FULLY for each one before ending the turn — is it clean, pristine, and will it make the user proud?`;
		},
		cooldown: 0,
	};
}
