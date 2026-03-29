# TECH_STACK.md — Technology Stack

## Stack at a Glance

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| Frontend Framework | Next.js | 14.x | React SPA with file-based routing |
| UI Language | React | 18.x | Component-based UI |
| Styling | CSS Modules | — | Scoped component styles |
| Drag & Drop | @hello-pangea/dnd | 1.x | Smooth list + card DnD |
| State Management | Zustand | 4.x | Lightweight global store |
| HTTP Client | Axios | 1.x | API calls with interceptors |
| Backend Framework | Express.js | 4.x | REST API server |
| Runtime | Node.js | 20.x LTS | Server runtime |
| Database | PostgreSQL | 15.x | Relational data store |
| ORM / Query Builder | node-postgres (pg) | 8.x | Raw SQL with connection pool |
| Validation | Zod | 3.x | Schema validation on API inputs |
| Deployment (Frontend) | Vercel | — | Auto-deploys from GitHub |
| Deployment (Backend) | Render | — | Web service + PostgreSQL add-on |

---

## Frontend

### Next.js 14 (App Router)

**Why Next.js over plain React?**
- File-based routing out of the box (no `react-router` setup needed)
- Easy environment variable handling (`NEXT_PUBLIC_*`)
- Built-in optimizations (image, fonts)
- Deployes to Vercel with zero config

**Key configuration:**
```js
// next.config.js
module.exports = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL}/:path*`,
      },
    ];
  },
};
```

---

### @hello-pangea/dnd

**Why this library?**
- Maintained fork of the widely-used `react-beautiful-dnd` (which is now archived)
- Purpose-built for accessible vertical and horizontal drag-and-drop in React
- Declarative API that matches Trello's exact use case (columns + cards)
- No physics simulation overhead (unlike `dnd-kit`) — simpler mental model

**Installation:**
```bash
npm install @hello-pangea/dnd
```

**Core API used:**
| Component | Role |
|-----------|------|
| `<DragDropContext>` | Top-level provider, receives `onDragEnd` |
| `<Droppable>` | Drop zone (board for lists, list for cards) |
| `<Draggable>` | Draggable item (list or card) |

---

### Zustand (State Management)

**Why Zustand over Redux?**
- Minimal boilerplate — no actions, reducers, or dispatchers required
- Works seamlessly with React hooks
- Built-in support for immer-style mutations
- Sufficient for this project's scale (one active board at a time)

**Store structure:**
```js
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

const useBoardStore = create(immer((set) => ({
  lists: [],
  cards: {},            // { [listId]: Card[] }
  activeCardId: null,
  searchQuery: '',
  filters: { labels: [], members: [], dueDate: null },

  setLists: (lists) => set((state) => { state.lists = lists; }),
  moveCard: ({ cardId, fromListId, toListId, newIndex }) =>
    set((state) => {
      // mutate state.cards[fromListId] and state.cards[toListId]
    }),
})));
```

---

### Axios

**Why Axios?**
- Automatic JSON serialization / deserialization
- Request/response interceptors for global error handling
- Cleaner syntax than native `fetch` for this project's API surface

**Base instance:**
```js
// src/services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
});

api.interceptors.response.use(
  (res) => res.data,
  (err) => Promise.reject(err.response?.data || err)
);

export default api;
```

---

### Styling: CSS Modules

**Why CSS Modules over Tailwind?**
- No build-time configuration needed
- Keeps style co-located with components
- Easier to replicate Trello's exact pixel values without utility-class gymnastics
- Evaluators can clearly see which styles apply to which component

**Trello-inspired CSS variables:**
```css
/* styles/variables.css */
:root {
  --color-bg-board:     #0052cc;
  --color-bg-canvas:    #f1f2f4;
  --color-list:         #f1f2f4;
  --color-card:         #ffffff;
  --color-card-hover:   #f1f2f4;
  --color-primary:      #0c66e4;
  --color-danger:       #ca3521;
  --color-text-main:    #172b4d;
  --color-text-muted:   #626f86;
  --color-border:       #dfe1e6;
  --radius-card:        8px;
  --radius-list:        12px;
  --shadow-card:        0 1px 2px rgba(0,0,0,0.15);
}
```

---

## Backend

### Node.js + Express.js

**Why Express?**
- Industry standard; familiar to most interviewers
- Lightweight and flexible (no opinionated structure forced)
- Easy middleware composition

**Core middleware stack:**
```js
// src/app.js
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN }));
app.use(express.json());
app.use(require('./middleware/requestLogger'));

app.use('/api', require('./routes'));

app.use(require('./middleware/errorHandler')); // must be last
```

---

### PostgreSQL + node-postgres (pg)

**Why raw SQL over a full ORM like Prisma or Sequelize?**
- The schema design is evaluated — raw SQL makes it visible and explainable
- No ORM magic to hide behind; every query is intentional
- Gives full control over JOIN shapes, indexes, and ordering

**Connection pool:**
```js
// src/config/db.js
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

module.exports = { query: (text, params) => pool.query(text, params) };
```

**Usage in repository:**
```js
const db = require('../config/db');

const findCardById = async (id) => {
  const { rows } = await db.query(
    `SELECT c.*, 
            json_agg(DISTINCT l.*) FILTER (WHERE l.id IS NOT NULL) AS labels,
            json_agg(DISTINCT m.*) FILTER (WHERE m.id IS NOT NULL) AS members,
            json_agg(DISTINCT ci.* ORDER BY ci.position) FILTER (WHERE ci.id IS NOT NULL) AS checklist
     FROM cards c
     LEFT JOIN card_labels cl ON cl.card_id = c.id
     LEFT JOIN labels l ON l.id = cl.label_id
     LEFT JOIN card_members cm ON cm.card_id = c.id
     LEFT JOIN members m ON m.id = cm.member_id
     LEFT JOIN checklist_items ci ON ci.card_id = c.id
     WHERE c.id = $1
     GROUP BY c.id`,
    [id]
  );
  return rows[0] || null;
};
```

---

### Zod (Validation)

Used to validate incoming request bodies before hitting the database:

```js
const { z } = require('zod');

const createCardSchema = z.object({
  listId: z.string().uuid(),
  title: z.string().min(1).max(512),
});

const validateBody = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ error: result.error.flatten() });
  }
  req.body = result.data;
  next();
};
```

---

## Database Design Decisions

### Ordering Strategy

Cards and lists have a `position` column (float/integer). When reordering:
- **Integer approach**: Recalculate all positions in the affected list on every move.
- **Float approach** (LexoRank-lite): Insert items between existing positions to minimize writes.

For this project, **integer positions with full recalculation** is recommended — simpler to explain during evaluation.

```sql
-- After moving a card to position 2 in a list:
UPDATE cards
SET position = CASE
  WHEN id = $cardId THEN 2
  WHEN position >= 2 THEN position + 1
END
WHERE list_id = $listId;
```

### Indexes

```sql
CREATE INDEX idx_lists_board_id ON lists(board_id);
CREATE INDEX idx_cards_list_id  ON cards(list_id);
CREATE INDEX idx_cards_title    ON cards USING gin(to_tsvector('english', title));
CREATE INDEX idx_card_labels    ON card_labels(card_id);
CREATE INDEX idx_card_members   ON card_members(card_id);
```

---

## Deployment

### Frontend → Vercel

1. Push `frontend/` to GitHub
2. Connect repo to Vercel
3. Set `NEXT_PUBLIC_API_URL` in Vercel environment variables
4. Deploy (automatic on every push to `main`)

### Backend → Render

1. Create a **Web Service** pointing to `backend/`
2. Set build command: `npm install`
3. Set start command: `node server.js`
4. Add **PostgreSQL** add-on (or use Neon / Supabase for free tier)
5. Set `DATABASE_URL` and `CORS_ORIGIN` in Render environment variables

### Alternative Free Hosts

| Service | Suits |
|---------|-------|
| Railway | Backend + PostgreSQL (generous free tier) |
| Supabase | PostgreSQL with REST auto-generated (use as DB only) |
| Neon | Serverless PostgreSQL (free tier) |
| Netlify | Frontend alternative to Vercel |

---

## Development Scripts

### Frontend

```bash
npm run dev       # Start Next.js dev server (localhost:3000)
npm run build     # Production build
npm run lint      # ESLint check
```

### Backend

```bash
npm run dev       # Nodemon dev server (localhost:5000)
npm start         # Production server
npm run migrate   # Run SQL migrations
npm run seed      # Seed sample data
```
