---
trigger: always_on
---

# Trello Clone — Antigravity Agent Rules

> These rules govern every AI-assisted action in this codebase.
> Read them fully before planning or writing any code.

---

## 1. Project Identity

This is a **Kanban-style project management tool** (Trello Clone) submitted as a Scaler SDE Intern Fullstack Assignment. Every decision — architecture, naming, styling, database design — will be reviewed and explained during a live evaluation interview. Write code that is **correct, readable, and explainable**, not clever.

- **Evaluation criteria:** Functionality, UI/UX (Trello resemblance), Drag & Drop quality, Database design, Code quality, Modularity, and Code understanding.
- **Deadline pressure is real** — prioritize core features over bonus features. Never leave core features broken to chase bonus work.
- **Plagiarism = disqualification.** Do not copy from existing Trello clone repos. All implementations must be original.

---

## 2. Tech Stack (Non-Negotiable)

| Layer | Technology | Notes |
|-------|-----------|-------|
| Frontend | Next.js 14 (App Router) | React 18, JSX |
| Styling | CSS Modules | No Tailwind, no inline styles for static values |
| Drag & Drop | @hello-pangea/dnd | Do not substitute with dnd-kit or react-dnd |
| State | Zustand + Immer | No Redux, no Context API for global state |
| HTTP Client | Axios | No raw fetch() in components |
| Backend | Node.js + Express.js | No NestJS, no Fastify |
| Database | PostgreSQL | No MongoDB, no SQLite |
| DB Driver | node-postgres (pg) | No Prisma, no Sequelize — raw SQL only |
| Validation | Zod | Backend input validation only |

> **Why raw SQL over an ORM?** The database schema is explicitly evaluated. Raw SQL keeps every query visible, intentional, and explainable. Never hide schema decisions behind ORM abstractions.

---

## 3. Folder & File Rules

### Always follow the established directory structure:

```
frontend/src/
  components/         ← UI only, no API calls
    Board/
    List/
    Card/
    CardDetail/
    Search/
    common/
  hooks/              ← Custom React hooks
  services/           ← ALL API calls live here
  store/              ← Zustand slices
  utils/              ← Pure helper functions
  constants/          ← No magic strings or numbers in code

backend/src/
  routes/             ← HTTP routing only
  controllers/        ← Parse req, call service, send res
  services/           ← Business logic
  repositories/       ← All SQL queries
  middleware/         ← errorHandler, requestLogger, validateBody

database/
  migrations/         ← Numbered SQL files (001_, 002_, ...)
  seeds/              ← One seed file per entity
```

### File naming rules:
- React components → `PascalCase.jsx` (e.g., `CardDetailModal.jsx`)
- Hooks → `camelCase.js` with `use` prefix (e.g., `useDragDrop.js`)
- Services, controllers, repositories → `camelCase.js` (e.g., `cardService.js`)
- Backend routes → `kebab-case.js` (e.g., `card-routes.js`)
- DB migrations → `NNN_verb_table.sql` (e.g., `003_create_cards.sql`)
- Constants → `SCREAMING_SNAKE_CASE.js` (e.g., `LABEL_COLORS.js`)

---

## 4. Component Rules

### Structure every component file in this exact order:
1. External imports (React, libraries)
2. Internal imports (components, services, utils)
3. Style import (`.module.css`)
4. Local constants
5. Component function (named, not anonymous arrow)
6. PropTypes (if no TypeScript)
7. Default export

### Component constraints:
- **No API calls inside components.** All `axios` calls go in `src/services/`. Components call service functions only.
- **No business logic in components.** Extract to a custom hook or service.
- **Named function declarations only.** Never `export default () => {}`.
- **One component per file.** Split large components into smaller ones.
- **Props must be documented** via PropTypes or JSDoc.

```jsx
// ✅ Correct
function CardItem({ card, index, onCardClick }) {
  const isOverdue = card.dueDate && new Date(card.dueDate) < new Date();
  const handleClick = () => onCardClick(card.id);
  return <div onClick={handleClick}>...</div>;
}
export default CardItem;

// ❌ Wrong — anonymous, logic mixed, direct API call inside
export default ({ card }) => {
  fetch(`/api/cards/${card.id}`); // never
  return <div>...</div>;
};
```

---

## 5. State Management Rules

- Global state lives **only in Zustand store slices** (`src/store/`).
- Local UI state (hover, editing mode, modal open) uses `useState` inside the component — do not put it in the global store.
- Use **Immer middleware** for all mutations. Never mutate state directly.
- **Optimistic updates are mandatory** for drag-and-drop and inline edits:
  1. Update local state immediately (zero perceived latency)
  2. Fire API call in background
  3. On error: rollback state + show toast notification

```js
// Optimistic update pattern — always follow this
const handleDragEnd = async (result) => {
  const { source, destination, draggableId, type } = result;
  if (!destination) return;

  // Step 1: Optimistic update
  store.moveCard({ draggableId, source, destination });

  try {
    // Step 2: Sync with server
    await cardService.reorderCards({ cardId: draggableId, newListId: destination.droppableId, newPosition: destination.index });
  } catch {
    // Step 3: Rollback
    store.moveCard({ draggableId, source: destination, destination: source });
    toast.error('Failed to move card.');
  }
};
```

---

## 6. API & Service Layer Rules

- Every backend resource has a corresponding service file in `frontend/src/services/`.
- Services export named async functions. No default exports.
- The Axios base instance lives in `src/services/api.js` — import it everywhere else.
- Never hardcode endpoint strings in service files; import from `src/constants/API_ROUTES.js`.

```js
// src/services/cardService.js
import api from './api';
import { API_ROUTES } from '../constants/API_ROUTES';

export const getCardById   = (id)         => api.get(`${API_ROUTES.CARDS}/${id}`);
export const updateCard    = (id, data)   => api.patch(`${API_ROUTES.CARDS}/${id}`, data);
export const reorderCards  = (payload)    => api.patch(`${API_ROUTES.CARDS}/reorder`, payload);
export const deleteCard    = (id)         => api.delete(`${API_ROUTES.CARDS}/${id}`);
```

---

## 7. Backend Layering Rules

### Controller → Service → Repository chain is mandatory:

```
Request → Router → Controller → Service → Repository → DB
```

- **Controller:** Only parses `req`, calls one service method, sends `res`. No SQL, no logic.
- **Service:** All business logic. Calls one or more repository functions. No `req`/`res` objects.
- **Repository:** All SQL queries. Returns plain JS objects. No business logic.

```js
// Controller — thin
const getCard = async (req, res, next) => {
  try {
    const card = await cardService.getCardById(req.params.id);
    if (!card) return res.status(404).json({ error: 'Card not found' });
    res.json(card);
  } catch (err) { next(err); }
};

// Service — logic
const getCardById = async (id) => cardRepo.findById(id);

// Repository — SQL
const findById = async (id) => {
  const { rows } = await db.query(
    `SELECT c.*, json_agg(DISTINCT l.*) ... FROM cards c ... WHERE c.id = $1`,
    [id]
  );
  return rows[0] || null;
};
```

### Error handling:
- All errors propagate via `next(err)` to the centralized `errorHandler` middleware.
- Never swallow errors with an empty catch block.
- Use parameterized queries (`$1`, `$2`) always — never string-concatenate SQL values.

---

## 8. Database Rules

### Schema requirements:
- All tables use `snake_case` plural names: `boards`, `lists`, `cards`, `checklist_items`, `card_labels`, `card_members`.
- All columns use `snake_case`: `board_id`, `is_archived`, `created_at`.
- Primary keys: `id UUID DEFAULT gen_random_uuid()` or `SERIAL` — pick one and use it everywhere.
- Foreign keys must have `ON DELETE CASCADE` where appropriate (e.g., deleting a list deletes its cards).
- Every table must have `created_at TIMESTAMPTZ DEFAULT NOW()`.

### Required indexes (do not skip — they are evaluated):
```sql
CREATE INDEX idx_lists_board_id    ON lists(board_id);
CREATE INDEX idx_cards_list_id     ON cards(list_id);
CREATE INDEX idx_cards_position    ON cards(list_id, position);
CREATE INDEX idx_card_labels       ON card_labels(card_id);
CREATE INDEX idx_card_members      ON card_members(card_id);
CREATE INDEX idx_checklist_card_id ON checklist_items(card_id);
-- For full-text search on card titles:
CREATE INDEX idx_cards_title_fts   ON cards USING gin(to_tsvector('english', title));
```

### Card/List ordering:
- Use an integer `position` column (0-indexed).
- On reorder, recalculate all positions in the affected list(s).
- Never use float positions or LexoRank — keep it simple and explainable.

### Seed data (mandatory before submission):
The seed must include:
- ✅ 1 default board titled "My Project Board"
- ✅ 4 lists: "To Do", "In Progress", "In Review", "Done"
- ✅ At least 10 cards distributed across the lists
- ✅ 5 members with names, initials, and avatar colors
- ✅ 6 labels: Red, Orange, Yellow, Green, Blue, Purple

---

## 9. Drag-and-Drop Rules

- Use `@hello-pangea/dnd` exclusively. No substitutions.
- `<DragDropContext>` wraps the entire `BoardCanvas` component.
- Lists use `type="LIST"` and `direction="horizontal"` on `<Droppable>`.
- Cards use `type="CARD"` and default vertical direction on each list's `<Droppable>`.
- `draggableId` must be a stable, unique string: use the entity's UUID.
- The `handleDragEnd` function lives in `useDragDrop.js` hook — not inside a component.
- Always return early if `!result.destination` or source equals destination (same index, same droppable).

```jsx
// BoardCanvas.jsx — correct structure
<DragDropContext onDragEnd={handleDragEnd}>
  <Droppable droppableId="board" direction="horizontal" type="LIST">
    {(provided) => (
      <div ref={provided.innerRef} {...provided.droppableProps} className={styles.canvas}>
        {lists.map((list, index) => (
          <Draggable key={list.id} draggableId={list.id} index={index} type="LIST">
            {(provided) => (
              <div ref={provided.innerRef} {...provided.draggableProps}>
                <ListColumn list={list} dragHandleProps={provided.dragHandleProps} />
              </div>
            )}
          </Draggable>
        ))}
        {provided.placeholder}
      </div>
    )}
  </Droppable>
</DragDropContext>
```

---

## 10. UI/UX Rules (Trello Resemblance)

The evaluator will compare the UI to Trello directly. Follow these rules exactly:

### Layout:
- Board canvas is **horizontally scrollable** with lists side-by-side.
- Lists have a **fixed width of ~272px**.
- Cards stack vertically inside lists.
- Clicking a card opens a **modal overlay** (not a new page).
- A persistent "Add a list" button sits at the end of the list row.

### Colors (use CSS variables from `styles/variables.css`):
```css
--color-bg-board:   #0052cc;   /* default board background */
--color-bg-canvas:  #0052cc;
--color-list:       #f1f2f4;   /* list column background */
--color-card:       #ffffff;
--color-primary:    #0c66e4;
--color-danger:     #ca3521;
--color-text-main:  #172b4d;
--color-text-muted: #626f86;
--color-border:     #dfe1e6;
--radius-card:      8px;
--radius-list:      12px;
--shadow-card:      0 1px 2px rgba(0,0,0,0.15);
```

### Label colors (Trello standard):
```js
// constants/LABEL_COLORS.js
export const LABEL_COLORS = {
  red:    '#f87462',
  orange: '#faa53d',
  yellow: '#f5cd47',
  green:  '#4bce97',
  blue:   '#579dff',
  purple: '#9f8fef',
};
```

### Interaction rules:
- Card titles are editable **inline** (click to edit, blur/Enter to save).
- List titles are editable inline.
- All delete actions must show a **confirmation step** (confirm button, not browser `confirm()`).
- Show loading skeleton or spinner on initial board fetch.
- Show toast notifications on all async errors.

---

## 11. Search & Filter Rules

- Search is performed against card **titles only** (full-text or ILIKE).
- Filters are additive (AND logic): a card must match all active filters simultaneously.
- Filter options: labels (multi-select), members (multi-select), due date (overdue / due soon / no date).
- Filtering happens **client-side** against already-loaded board data — no extra API calls per filter change.
- The search input is **debounced at 300ms**.
- Search/filter state lives in the Zustand store under `ui.searchQuery` and `ui.filters`.
- Filtered-out cards are hidden but **lists remain visible** (do not hide empty lists during search).

---

## 12. What the Agent Must Never Do

| Action | Reason |
|--------|--------|
| Use `fetch()` directly in a component | Violates service layer separation |
| Use string concatenation in SQL queries | SQL injection risk |
| Use `any` type without a comment explaining why | Reduces type safety |
| Add `console.log` in committed code | Use a logger or remove before commit |
| Use an ORM (Prisma, Sequelize) | Schema must be explicit and evaluatable |
| Use `localStorage` for state | App state lives in Zustand |
| Skip error handling on async functions | Every `await` must have a try/catch |
| Write to the database in a controller | Must go through service → repository |
| Use `Math.random()` for IDs | Use `gen_random_uuid()` in PostgreSQL |
| Copy from existing Trello clone repos | Disqualification risk |

---

## 13. Planning Mode Requirement

> Before writing any code for a feature, output a brief plan:
> 1. Files to create or modify
> 2. Database changes (if any)
> 3. API endpoint (if any)
> 4. Component + state changes
> 5. Potential edge cases

This ensures the implementation matches the architecture and prevents costly rewrites.

---

## 14. Definition of Done

A feature is **done** only when:

- [ ] Backend endpoint returns correct data and handles errors
- [ ] Frontend service function calls the endpoint
- [ ] State updates correctly (including optimistic update where needed)
- [ ] UI renders the feature correctly at all viewport sizes
- [ ] Drag-and-drop (if applicable) persists order after page refresh
- [ ] No `console.log` statements remain
- [ ] No hardcoded strings (IDs, URLs, colors) — all in constants
- [ ] Edge cases handled: empty states, loading states, error states
