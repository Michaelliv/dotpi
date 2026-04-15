/**
 * Block sed-based file editing. Use the edit tool instead.
 */
import type { ExtensionAPI } from "@mariozechner/pi-coding-agent";

const SED_INPLACE = /\bsed\b.*-i/;
const SED_REDIRECT = /\bsed\b\s+(['"]?)s\/.*>\s*/;

export default function (pi: ExtensionAPI) {
  pi.on("tool_call", async (event) => {
    if (event.toolName === "bash" || event.toolName === "Bash") {
      const cmd = (event.input as { command?: string })?.command ?? "";
      if (SED_INPLACE.test(cmd) || SED_REDIRECT.test(cmd)) {
        return { block: true, reason: "sed file editing is not allowed. Use the edit tool instead." };
      }
    }
  });
}
