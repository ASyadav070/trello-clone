# DIRECTORY_STRUCTURE.md — Project Directory Layout

## Root

```
trello-clone/
├── frontend/               ← React / Next.js application
├── backend/                ← Node.js + Express API
├── .gitignore
└── README.md               ← Setup instructions (required for submission)
```

---

## Frontend

```
frontend/
├── public/
│   ├── favicon.ico
│   └── images/
│       └── default-avatar.png
│
├── src/
│   ├── app/                        ← (Next.js App Router) OR pages/ for Pages Router
│   │   ├── layout.jsx              ← Root layout (fonts, global providers)
│   │   ├── page.jsx                ← Boards listing page (home)
│   │   └── board/
│   │       └── [boardId]/
│   │           └── page.jsx        ← Individual board workspace
│   │
│   ├── components/
│   │   ├── Board/
│   │   │   ├── BoardCanvas.jsx     ← Drag-and-drop context, horizontal list container
│   │   │   ├── BoardHeader.jsx     ← Title, search bar, filter controls
│   │   │   ├── BoardCard.jsx       ← Board thumbnail on home page
│   │   │   └── AddBoardModal.jsx   ← Create new board dialog
│   │   │
│   │   ├── List/
│   │   │   ├── ListColumn.jsx      ← Draggable list wrapper + droppable card zone
│   │   │   ├── ListHeader.jsx      ← Editable title, list menu (delete, etc.)
│   │   │   └── AddListButton.jsx   ← Inline "Add a list" input
│   │   │
│   │   ├── Card/
│   │   │   ├── CardItem.jsx        ← Draggable card in the list column
│   │   │   ├── CardLabels.jsx      ← Colored label chips on card face
│   │   │   ├── CardMeta.jsx        ← Due date badge, checklist progress, member avatars
│   │   │   └── AddCardButton.jsx   ← Inline "Add a card" input
│   │   │
│   │   ├── CardDetail/
│   │   │   ├── CardDetailModal.jsx ← Full-screen modal overlay
│   │   │   ├── CardTitle.jsx       ← Editable card title
│   │   │   ├── CardDescription.jsx ← Editable description (textarea)
│   │   │   ├── LabelPicker.jsx     ← Multi-select label dropdown
│   │   │   ├── DueDatePicker.jsx   ← Date input + display
│   │   │   ├── MemberAssigner.jsx  ← Member search + avatar list
│   │   │   ├── ChecklistSection.jsx← Checklist container + add item
│   │   │   └── ChecklistItem.jsx   ← Individual checklist row
│   │   │
│   │   ├── Search/
│   │   │   ├── SearchBar.jsx       ← Controlled text input
│   │   │   └── FilterPanel.jsx     ← Label / member / due date filter chips
│   │   │
│   │   └── common/
│   │       ├── Avatar.jsx          ← Member avatar with initials fallback
│   │       ├── Button.jsx          ← Styled button variants
│   │       ├── Dropdown.jsx        ← Generic dropdown/popover
│   │       ├── Modal.jsx           ← Base modal wrapper
│   │       ├── Spinner.jsx         ← Loading indicator
│   │       └── Toast.jsx           ← Error / success notifications
│   │
│   ├── hooks/
│   │   ├── useBoard.js             ← Fetch and manage active board state
│   │   ├── useCards.js             ← Card CRUD operations
│   │   ├── useDragDrop.js          ← handleDragEnd logic
│   │   ├── useSearch.js            ← Search + filter derived state
│   │   └── useDebounce.js          ← Debounce hook for search input
│   │
│   ├── services/                   ← All API calls (no fetch in components)
│   │   ├── api.js                  ← Axios instance with baseURL + interceptors
│   │   ├── boardService.js
│   │   ├── listService.js
│   │   ├── cardService.js
│   │   ├── labelService.js
│   │   ├── memberService.js
│   │   └── checklistService.js
│   │
│   ├── store/                      ← Global state (Zustand or Redux Toolkit)
│   │   ├── index.js                ← Store initialization
│   │   ├── boardSlice.js           ← Board + lists + cards state
│   │   ├── uiSlice.js              ← Modal, search, filter state
│   │   └── memberSlice.js          ← Members list
│   │
│   ├── utils/
│   │   ├── formatDueDate.js        ← Date formatting helpers
│   │   ├── reorderArray.js         ← Pure function for drag reorder logic
│   │   └── getLabelColor.js        ← Map label name → hex color
│   │
│   ├── constants/
│   │   ├── LABEL_COLORS.js         ← Trello-style label color palette
│   │   └── API_ROUTES.js           ← Centralized endpoint strings
│   │
│   └── styles/
│       ├── globals.css             ← CSS reset + root variables
│       └── variables.css           ← Color tokens, spacing, typography
│
├── .env.local                      ← NEXT_PUBLIC_API_URL (gitignored)
├── .env.example                    ← Template for env vars
├── next.config.js
├── package.json
└── README.md
```

---

## Backend

```
backend/
├── src/
│   ├── config/
│   │   ├── db.js               ← Database connection pool (pg / Sequelize / Prisma)
│   │   └── env.js              ← Validate and export environment variables
│   │
│   ├── routes/
│   │   ├── index.js            ← Mount all routers under /api
│   │   ├── board-routes.js
│   │   ├── list-routes.js
│   │   ├── card-routes.js
│   │   ├── label-routes.js
│   │   ├── member-routes.js
│   │   ├── checklist-routes.js
│   │   └── search-routes.js
│   │
│   ├── controllers/
│   │   ├── boardController.js
│   │   ├── listController.js
│   │   ├── cardController.js
│   │   ├── labelController.js
│   │   ├── memberController.js
│   │   ├── checklistController.js
│   │   └── searchController.js
│   │
│   ├── services/
│   │   ├── boardService.js
│   │   ├── listService.js      ← Includes position recalculation
│   │   ├── cardService.js      ← Includes move-card logic
│   │   ├── labelService.js
│   │   ├── memberService.js
│   │   ├── checklistService.js
│   │   └── searchService.js    ← Query builder for search + filters
│   │
│   ├── repositories/           ← All SQL / ORM queries live here
│   │   ├── boardRepository.js
│   │   ├── listRepository.js
│   │   ├── cardRepository.js
│   │   ├── labelRepository.js
│   │   ├── memberRepository.js
│   │   └── checklistRepository.js
│   │
│   ├── middleware/
│   │   ├── errorHandler.js     ← Global error middleware (must be last)
│   │   ├── requestLogger.js    ← Log incoming requests
│   │   └── validateBody.js     ← Input validation helper
│   │
│   └── app.js                  ← Express app setup (cors, json, routes, error handler)
│
├── database/
│   ├── migrations/
│   │   ├── 001_create_boards.sql
│   │   ├── 002_create_lists.sql
│   │   ├── 003_create_cards.sql
│   │   ├── 004_create_labels.sql
│   │   ├── 005_create_members.sql
│   │   ├── 006_create_card_labels.sql
│   │   ├── 007_create_card_members.sql
│   │   └── 008_create_checklist_items.sql
│   │
│   └── seeds/
│       ├── seed.js             ← Main seed runner
│       ├── boards.seed.js
│       ├── lists.seed.js
│       ├── cards.seed.js
│       ├── labels.seed.js
│       └── members.seed.js
│
├── server.js                   ← Entry point (starts HTTP server)
├── .env                        ← DATABASE_URL, PORT, etc. (gitignored)
├── .env.example
├── package.json
└── README.md
```

---

## Key File Responsibilities (Quick Reference)

| File | What it does |
|------|-------------|
| `BoardCanvas.jsx` | Houses `<DragDropContext>` and renders all `<ListColumn>` side by side |
| `ListColumn.jsx` | `<Droppable>` zone for cards; renders `<CardItem>` list |
| `CardItem.jsx` | `<Draggable>` card; clicking opens `CardDetailModal` |
| `CardDetailModal.jsx` | Full card editor: title, description, labels, due date, members, checklist |
| `useDragDrop.js` | `handleDragEnd` — updates state optimistically, calls API |
| `useSearch.js` | Derives filtered card list from raw cards + active filters |
| `cardService.js` (backend) | `moveCard()` — recalculates positions across lists |
| `searchService.js` | Builds dynamic SQL query for title, label, member, due date filters |
| `seed.js` | Inserts default board, 4 lists, 10+ cards, 5 members, 6 labels |

---

## Gitignore Highlights

```
# Dependencies
node_modules/

# Environment files
.env
.env.local
.env.*.local

# Build output
.next/
dist/
build/

# OS / Editor
.DS_Store
.vscode/
*.log
```
