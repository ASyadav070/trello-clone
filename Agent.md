# Agent.md — AI Development Guidelines

## Project Overview

This is a **Kanban-style Project Management Tool** (Trello Clone) built as a fullstack SDE Intern assignment. The goal is to closely replicate Trello's UI/UX while implementing all core board, list, card, and drag-and-drop features.

---

## Agent Responsibilities

When working on this codebase, an AI agent should:

1. **Understand before generating** — Read existing files, component structures, and API contracts before writing new code.
2. **Stay in scope** — Prioritize core features first (boards, lists, cards, drag-and-drop), then bonus features.
3. **Maintain consistency** — Follow the conventions defined in `Conventions.md` at all times.
4. **Explain decisions** — Every non-trivial implementation choice should be commented or documented, since the evaluator will ask the developer to explain the code.

---

## Development Workflow

### Step-by-Step Task Order

```
1. Database schema design & migrations
2. Backend API (REST endpoints)
3. Seed script (sample data)
4. Frontend project setup (React + routing)
5. Core UI components (Board, List, Card)
6. API integration (connect frontend to backend)
7. Drag-and-drop implementation
8. Card detail modal (labels, due date, checklist, members)
9. Search & Filter functionality
10. Polish, responsiveness, deployment
```

### Feature Priority

| Priority | Feature |
|----------|---------|
| P0 | Board view, List CRUD, Card CRUD |
| P0 | Drag-and-drop (lists + cards) |
| P1 | Card details (labels, due date, checklist, members) |
| P1 | Search & Filter |
| P2 | Multiple boards, responsive design |
| P3 | Comments, file attachments, card covers, board backgrounds |

---

## Key Constraints

- **No authentication required** — A default user is assumed to be logged in. Hardcode or seed a default user.
- **Sample members** — Seed 3–5 members in the database for the card assignment feature.
- **Sample board** — The database seed must include at least one board with lists and cards pre-populated.
- **UI must resemble Trello** — Study trello.com before building components. Match layout, colors, and interactions closely.

---

## Agent Dos and Don'ts

### Do
- Keep components small and single-purpose.
- Use optimistic UI updates for drag-and-drop (update state immediately, sync with API in background).
- Write meaningful variable and function names.
- Handle loading and error states in every API call.
- Add JSDoc comments on complex utility functions.

### Don't
- Don't copy code from existing Trello clone repositories (disqualification risk).
- Don't generate code you wouldn't be able to explain line-by-line.
- Don't use `any` types in TypeScript without justification.
- Don't mix business logic into UI components.
- Don't skip database index design — it is evaluated.

---

## Evaluation Checklist

Before submitting, verify:

- [ ] All core features are functional end-to-end
- [ ] Drag-and-drop works for both lists and cards
- [ ] Card detail modal shows labels, due date, checklist, and members
- [ ] Search by title works
- [ ] Filter by label / member / due date works
- [ ] Database schema has proper foreign keys and indexes
- [ ] README has setup instructions
- [ ] App is deployed and accessible via public URL
- [ ] GitHub repo is public

---

## Prompting Tips for AI Assistants

When using Claude, ChatGPT, or Copilot during development:

- Provide context: share the relevant file or schema before asking for code.
- Ask for explanations: "Explain why you chose this approach."
- Request alternatives: "Show me two ways to implement this, with trade-offs."
- Validate output: always test generated code before submitting.
- Break large requests into smaller ones (e.g., "generate the Card model" before "generate the full API").
