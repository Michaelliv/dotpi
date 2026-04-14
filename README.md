# dotpi

My [pi](https://github.com/badlogic/pi) setup.

## Structure

```
~/.pi/agent/
├── SYSTEM.md              # Custom system prompt
├── settings.json          # Model, packages, preferences
├── extensions/
│   └── pi-docs.ts         # Injects date, cwd, and pi docs each turn
└── reminders/
    └── read-fully.ts      # Nudges to read files fully after search ops
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

Tracks consecutive search operations (`rg`, `grep`, etc.) in bash calls. Every 2 searches, injects a system reminder nudging the agent to read files fully instead of relying on snippets.

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
| [napkin](https://github.com/Michaelliv/napkin) | git | Knowledge system for agents (Obsidian vault CLI) |
| [pi-ask-user-question](https://github.com/Michaelliv/pi-ask-user-question) | git | Interactive multi-choice question tool |
| [pi-charts](https://github.com/Michaelliv/pi-charts) | git | Chart rendering (bar, line, pie, scatter, radar, etc.) |
| [pi-generative-ui](https://github.com/Michaelliv/pi-generative-ui) | git | Interactive HTML/SVG widgets in native macOS windows |
| [pi-universal-view](https://github.com/Michaelliv/pi-universal-view) | git | Universal file viewer |
| [pi-websearch-router](https://github.com/Michaelliv/pi-websearch) | npm | Web search with auto-detected provider |
| [pi-system-reminders](https://github.com/Michaelliv/pi-system-reminders) | git | Reactive system reminders framework |

## Install

```bash
# Install pi
npm i -g @mariozechner/pi-coding-agent

# Copy system prompt
cp SYSTEM.md ~/.pi/agent/SYSTEM.md

# Copy extension and reminder
mkdir -p ~/.pi/agent/extensions ~/.pi/agent/reminders
cp extensions/pi-docs.ts ~/.pi/agent/extensions/pi-docs.ts
cp reminders/read-fully.ts ~/.pi/agent/reminders/read-fully.ts

# Install packages
pi install git:github.com/Michaelliv/napkin
pi install git:github.com/Michaelliv/pi-ask-user-question
pi install git:github.com/Michaelliv/pi-charts
pi install git:github.com/Michaelliv/pi-generative-ui
pi install git:github.com/Michaelliv/pi-universal-view
pi install npm:pi-websearch-router
pi install git:github.com/Michaelliv/pi-system-reminders
```

## License

MIT
