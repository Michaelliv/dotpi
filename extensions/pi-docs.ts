import type { ExtensionAPI } from "@mariozechner/pi-coding-agent";

const PI_DOCS = `Pi documentation (read only when the user asks about pi itself, its SDK, extensions, themes, skills, or TUI):
- Main documentation: /Users/michael/.npm-global/lib/node_modules/@mariozechner/pi-coding-agent/README.md
- Additional docs: /Users/michael/.npm-global/lib/node_modules/@mariozechner/pi-coding-agent/docs
- Examples: /Users/michael/.npm-global/lib/node_modules/@mariozechner/pi-coding-agent/examples (extensions, custom tools, SDK)
- When asked about: extensions (docs/extensions.md, examples/extensions/), themes (docs/themes.md), skills (docs/skills.md), prompt templates (docs/prompt-templates.md), TUI components (docs/tui.md), keybindings (docs/keybindings.md), SDK integrations (docs/sdk.md), custom providers (docs/custom-provider.md), adding models (docs/models.md), pi packages (docs/packages.md)
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
