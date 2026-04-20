import { homedir } from "node:os";
import { join } from "node:path";
import type { ExtensionAPI } from "@mariozechner/pi-coding-agent";

const PI_DOCS_DIR = join(homedir(), ".pi", "docs");

const PI_DOCS = `Pi documentation (read only when the user asks about pi itself, its SDK, extensions, themes, skills, or TUI):
- Main documentation: ${PI_DOCS_DIR}/README.md
- Additional docs: ${PI_DOCS_DIR}
- Examples: ${PI_DOCS_DIR}/examples (extensions, custom tools, SDK)
- When asked about: extensions (extensions.md, examples/extensions/), themes (themes.md), skills (skills.md), prompt templates (prompt-templates.md), TUI components (tui.md), keybindings (keybindings.md), SDK integrations (sdk.md), custom providers (custom-provider.md), adding models (models.md), pi packages (packages.md)
- When working on pi topics, read the docs and examples, and follow .md cross-references before implementing
- Always read pi .md files completely and follow links to related docs (e.g., tui.md for TUI API details)`;

export default function (pi: ExtensionAPI) {
  pi.on("before_agent_start", async (_event, ctx) => {
    const date = new Date().toISOString().slice(0, 10);
    const cwd = ctx.cwd;

    return {
      message: {
        customType: "pi-context",
        content: `Current date: ${date}\nCurrent working directory: ${cwd}\n\n${PI_DOCS}`,
        display: false,
      },
    };
  });
}
