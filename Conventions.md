# Conventions.md — Coding Conventions & Standards

## General Principles

- **Clarity over cleverness** — Write code that is easy to read and explain during evaluation.
- **Single Responsibility** — Each file, function, and component does one thing well.
- **Consistency** — When in doubt, match the style of surrounding code rather than introducing a new pattern.

---

## Naming Conventions

### Files & Directories

| Type | Convention | Example |
|------|-----------|---------|
| React components | PascalCase | `CardDetailModal.jsx` |
| Hooks | camelCase, `use` prefix | `useDragDrop.js` |
| Utility functions | camelCase | `formatDueDate.js` |
| API service files | camelCase | `cardService.js` |
| Constants | SCREAMING_SNAKE_CASE | `LABEL_COLORS.js` |
| Backend route files | kebab-case | `card-routes.js` |
| Backend controllers | camelCase | `cardController.js` |
| Database migrations | timestamp prefix | `20240101_create_boards.sql` |

### Variables & Functions

```js
// ✅ Good — descriptive names
const activeCardId = null;
const fetchBoardWithLists = async (boardId) => { ... };
const handleDragEnd = (result) => { ... };

// ❌ Bad — vague or abbreviated
const ac = null;
const fetch = async (id) => { ... };
const handler = (r) => { ... };
```

### React Components

```jsx
// ✅ Named function components (not anonymous arrows)
function CardItem({ card, onCardClick }) {
  return <div>...</div>;
}

export default CardItem;

// ❌ Avoid
export default ({ card }) => <div>...</div>;
```

### Database (PostgreSQL)

- Table names: **snake_case plural** → `boards`, `lists`, `cards`, `checklist_items`
- Column names: **snake_case** → `board_id`, `created_at`, `is_archived`
- Primary keys: always `id` (UUID or auto-increment integer — pick one and be consistent)
- Foreign keys: `{referenced_table_singular}_id` → `board_id`, `list_id`, `card_id`

---

## Frontend Conventions

### Component Structure

Every component file follows this top-to-bottom order:

```jsx
// 1. Imports (external → internal → styles)
import { useState, useEffect } from 'react';
import { Draggable } from '@hello-pangea/dnd';
import CardLabel from '../CardLabel/CardLabel';
import { updateCard } from '../../services/cardService';
import styles from './CardItem.module.css';

// 2. Constants local to this component
const MAX_TITLE_LENGTH = 512;

// 3. Component definition
function CardItem({ card, index, onCardClick }) {
  // 3a. State
  const [isEditing, setIsEditing] = useState(false);

  // 3b. Derived values / selectors
  const isOverdue = card.dueDate && new Date(card.dueDate) < new Date();

  // 3c. Effects
  useEffect(() => { ... }, [card.id]);

  // 3d. Handlers
  const handleTitleClick = () => setIsEditing(true);

  // 3e. Render helpers (only if needed — prefer subcomponents)
  const renderLabels = () => card.labels.map(l => <CardLabel key={l.id} label={l} />);

  // 3f. Return JSX
  return (
    <div className={styles.card}>
      {renderLabels()}
      <p>{card.title}</p>
    </div>
  );
}

// 4. PropTypes (if not using TypeScript)
CardItem.propTypes = { ... };

// 5. Default export
export default CardItem;
```

### CSS Conventions

- Use **CSS Modules** (`.module.css`) for all component styles.
- Use Trello's approximate color palette:
  - Background: `#f1f2f4`
  - Board canvas: `#0052cc` (default blue background)
  - List column: `#f1f2f4`
  - Card: `#ffffff`
  - Primary action: `#0c66e4`
  - Destructive: `#ca3521`
- No inline styles except for dynamic values (e.g., label color from DB).

```jsx
// ✅ Dynamic color — inline is acceptable
<span style={{ backgroundColor: label.color }}>{label.name}</span>

// ❌ Static style — use CSS module
<div style={{ padding: '8px', borderRadius: '4px' }}>
```

### API Calls (Service Layer)

All API calls live in `src/services/`. Components never call `fetch`/`axios` directly.

```js
// src/services/cardService.js
import api from './api'; // axios instance with baseURL

export const getCardById = (cardId) => api.get(`/cards/${cardId}`);

export const updateCard = (cardId, data) => api.patch(`/cards/${cardId}`, data);

export const reorderCards = (payload) => api.patch('/cards/reorder', payload);
```

### State Updates (Optimistic UI)

For drag-and-drop and quick edits, update the UI first and sync to the server asynchronously:

```js
const handleDragEnd = async (result) => {
  const { source, destination, draggableId, type } = result;
  if (!destination) return;

  // 1. Optimistic update
  dispatch(moveCard({ draggableId, source, destination }));

  // 2. Sync with server
  try {
    await reorderCards({ cardId: draggableId, newListId: destination.droppableId, newPosition: destination.index });
  } catch (err) {
    // 3. Rollback on failure
    dispatch(moveCard({ draggableId, source: destination, destination: source }));
    toast.error('Failed to move card. Please try again.');
  }
};
```

---

## Backend Conventions

### Controller Pattern

Controllers are thin — they only parse requests and delegate to services:

```js
// controllers/cardController.js
const cardService = require('../services/cardService');

const getCard = async (req, res, next) => {
  try {
    const card = await cardService.getCardById(req.params.id);
    if (!card) return res.status(404).json({ error: 'Card not found' });
    res.json(card);
  } catch (err) {
    next(err); // pass to global error handler
  }
};

module.exports = { getCard };
```

### Service Pattern

Business logic lives in services:

```js
// services/cardService.js
const cardRepo = require('../repositories/cardRepository');

const getCardById = async (id) => {
  return cardRepo.findById(id); // includes labels, members, checklist
};

const moveCard = async ({ cardId, newListId, newPosition }) => {
  // 1. Update card's list_id
  // 2. Recalculate positions in source and destination lists
  return cardRepo.updatePosition(cardId, newListId, newPosition);
};

module.exports = { getCardById, moveCard };
```

### Error Handling

Use a centralized error handler in `middleware/errorHandler.js`:

```js
module.exports = (err, req, res, next) => {
  console.error(err.stack);
  const status = err.status || 500;
  res.status(status).json({
    error: err.message || 'Internal Server Error',
  });
};
```

### HTTP Status Codes

| Situation | Code |
|-----------|------|
| Success (read) | 200 |
| Created | 201 |
| No content (delete) | 204 |
| Bad request / validation | 400 |
| Not found | 404 |
| Server error | 500 |

---

## Git Conventions

### Branch Naming

```
main              ← stable, deployable
dev               ← integration branch
feature/board-dnd ← new features
fix/card-position ← bug fixes
chore/seed-data   ← non-feature work
```

### Commit Messages (Conventional Commits)

```
feat: add drag-and-drop for list reordering
fix: resolve card position reset on page refresh
chore: add database seed script
docs: update README with setup instructions
refactor: extract CardLabel into standalone component
style: align card modal with Trello design
```

---

## Environment Variables

### Backend `.env`

```env
PORT=5000
DATABASE_URL=postgresql://user:password@localhost:5432/trello_clone
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

### Frontend `.env.local`

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Never commit `.env` files. Always provide a `.env.example`.

---

## Code Review Checklist

Before committing, verify:

- [ ] No `console.log` left in production-bound code (use a logger)
- [ ] All API calls have error handling
- [ ] No hardcoded IDs or magic numbers (use constants)
- [ ] Component props are documented or typed
- [ ] Database queries use parameterized inputs (no SQL injection risk)
- [ ] All new features have been manually tested end-to-end
