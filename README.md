# dotpi

My [pi](https://github.com/badlogic/pi) setup.

## Structure

```
~/.pi/agent/
├── SYSTEM.md              # Custom system prompt
├── settings.json          # Model, packages, preferences
├── napkin.json            # Global vault path for napkin extensions
├── extensions/
│   └── pi-docs.ts         # Injects date, cwd, and pi docs each turn
├── reminders/
│   └── read-fully.ts      # Nudges to read files fully after search ops
└── kb/                    # Knowledge base (napkin vault)
    ├── .napkin/           # Vault config
    │   └── config.json
    ├── NAPKIN.md          # Context note (Level 0)
    ├── Templates/         # Note templates
    ├── decisions/
    ├── architecture/
    ├── guides/
    ├── changelog/
    ├── projects/
    └── daily/
```

## System Prompt

Custom `SYSTEM.md` — replaces pi's default system prompt with a trimmed version. Pi still appends date, cwd, skills, and context files automatically.

Key changes from default:
- Removed pi documentation section (moved to `pi-docs.ts` extension)
- Static tool/guidelines list for the core 4 tools (read, bash, edit, write)

## Extension: pi-docs.ts

Injects a hidden message every turn via `before_agent_start` containing:
- Current date
- Current working directory
- Pi documentation pointers (paths to docs, examples, and topic index)

This keeps the system prompt lean while still giving the model access to pi docs when needed.

## Reminder: read-fully.ts

Tracks consecutive search operations (`rg`, `grep`, etc.) in bash calls. Every 2 consecutive searches, injects a system reminder nudging the agent to read files fully instead of relying on snippets.

## Knowledge Base

A [napkin](https://github.com/Michaelliv/napkin) vault at `~/.pi/agent/kb/` with automatic knowledge distillation.

### How it works

```
Pi session (you + agent)
        │
        ├── napkin-context extension
        │   Injects vault overview into the agent's context on session start.
        │   The agent sees what's in the vault and can search/read it.
        │
        └── napkin-distill extension
            Runs on a timer (every 60 min). Forks the conversation,
            sends it to a cheap model (claude-sonnet-4-6), and distills
            knowledge into the vault — decisions, architecture notes,
            project context. /distill triggers it manually.
```

### Vault resolution

Napkin's pi extensions resolve the vault in this order:

1. **Local project vault** — walk up from cwd looking for `.napkin/`
2. **Global fallback** — read `~/.pi/agent/napkin.json` for a default vault path

This means project-specific vaults take priority when present, and the global `kb/` vault catches everything else.

### Template

Uses the `coding` template (decisions, architecture, guides, changelog) plus a custom `projects/` directory with a `Project` note template.

## Settings

| Setting | Value |
|---------|-------|
| Model | `claude-opus-4-6` |
| Thinking | `low` |
| Steering | `all` |
| Follow-up | `all` |

## Packages

| Package | Source | What it does |
|---------|--------|-------------|
| [pi-napkin](https://github.com/Michaelliv/pi-napkin) | git | Napkin integration — vault context, kb_search/kb_read tools, distillation |
| [pi-ask-user-question](https://github.com/Michaelliv/pi-ask-user-question) | git | Interactive multi-choice question tool |
| [pi-charts](https://github.com/Michaelliv/pi-charts) | git | Chart rendering (bar, line, pie, scatter, radar, etc.) |
| [pi-generative-ui](https://github.com/Michaelliv/pi-generative-ui) | git | Interactive HTML/SVG widgets in native macOS windows |
| [pi-universal-view](https://github.com/Michaelliv/pi-universal-view) | git | Universal file viewer |
| [pi-websearch-router](https://github.com/Michaelliv/pi-websearch) | npm | Web search with auto-detected provider |
| [pi-system-reminders](https://github.com/Michaelliv/pi-system-reminders) | git | Reactive system reminders framework |

## Install

```bash
# Install pi and napkin
npm i -g @mariozechner/pi-coding-agent
npm i -g napkin-ai

# Clone this repo
git clone https://github.com/Michaelliv/dotpi.git
cd dotpi

# Copy system prompt, extension, and reminder
cp SYSTEM.md ~/.pi/agent/SYSTEM.md
mkdir -p ~/.pi/agent/extensions ~/.pi/agent/reminders
cp extensions/pi-docs.ts ~/.pi/agent/extensions/pi-docs.ts
cp reminders/read-fully.ts ~/.pi/agent/reminders/read-fully.ts

# Install packages
pi install git:github.com/Michaelliv/pi-napkin
pi install git:github.com/Michaelliv/pi-ask-user-question
pi install git:github.com/Michaelliv/pi-charts
pi install git:github.com/Michaelliv/pi-generative-ui
pi install git:github.com/Michaelliv/pi-universal-view
pi install npm:pi-websearch-router
pi install git:github.com/Michaelliv/pi-system-reminders

# Set up knowledge base
cp napkin.json ~/.pi/agent/napkin.json
napkin init --path ~/.pi/agent/kb --template coding
mkdir -p ~/.pi/agent/kb/projects
cp kb/projects/_about.md ~/.pi/agent/kb/projects/_about.md
cp kb/Templates/Project.md ~/.pi/agent/kb/Templates/Project.md
napkin --vault ~/.pi/agent/kb config set --key distill.enabled --value true
```

## License

MIT
