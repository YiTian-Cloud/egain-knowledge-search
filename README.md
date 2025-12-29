# Part 2 — Search UI (UX & Frontend Architecture)
**eGain Knowledge Search Demo**

This folder contains **Part 2** of the eGain Knowledge Search demo: a fully interactive, frontend-only
knowledge search experience built with **React + TypeScript**.

> 🎯 **Objective**  
> Demonstrate user experience design, state management, component architecture, and frontend scalability —
> without requiring a backend dependency.

---
The knowledge search interface is built with Vite + React (TypeScript) and uses mocked APIs for demo simplicity.

Prerequisites

Node.js 18+

npm or yarn

Install & Run
# from repo root
npm install
npm run dev


Then open:

http://localhost:5173

Demo Deployment (Vercel)

The live demo is deployed on Vercel:

👉 Search UI (Part 2 Demo)
https://egain-knowledge-search.vercel.app

## UX Overview

The search interface is designed to mirror a real-world **customer support knowledge search workflow**.

### Core User Experience Features

- **Type-ahead search with suggestions**
  - Debounced input
  - Suggestions update in real time as the user types

- **Search history**
  - Automatically stores the **last 5 searches**
  - Cleared and refreshed as new searches occur
  - Enables quick re-search and exploration

- **Advanced filtering & sorting**
  - Filter by:
    - Category
    - Date range
  - Sort results by:
    - Relevance
    - Date
    - Popularity (view count)

- **Search results presentation**
  - Article title
  - Category & tags
  - Relevance score
  - Content preview/snippet

- **Article detail side panel**
  - Clicking a result opens a **side panel** (non-blocking)
  - Users can:
    - Read full article content
    - Save the article
    - Open in a new browser tab
    - Print the article

- **Saved articles**
  - Users can save articles directly from the detail panel
  - Saved state persists within the session

- **Responsive design**
  - Optimized for desktop and mobile
  - Side panel collapses gracefully on smaller screens
  - Touch-friendly controls

- **Extensibility (future-ready)**
  - Image-based search (visual KB articles)
  - Speech-to-text search input
  - AI-assisted answers (covered conceptually in Part 3)

---

## Technical Approach

### Frontend Stack
- **React (functional components)**
- **TypeScript** (preferred)
- **Vite** (fast dev/build tooling)
- **CSS (basic styling)** — no heavy UI framework dependency

---

## Mock API & Backend Abstraction

This demo intentionally avoids a real backend.

### Backend Pseudocode Layer

src/backend-pseudocode/
services/
searchService.ts
policies/
stores/
articleStore.ts


**Purpose**
- Simulates a real backend service layer
- Abstracts data sources behind service interfaces

**Design Rationale**
- In production, this layer could fetch from:
  - Databases
  - Cache layers (Redis)
  - External APIs
- For the demo:
  - Uses **in-memory article data**
  - Allows deterministic UX behavior without infrastructure

---

## State Management
src/state/
searchReducer.ts


- Centralized reducer for search state:
  - Query
  - Filters
  - Sort order
  - Pagination
  - Loading & error states
  - Selected article
  - Saved articles
- Predictable state transitions
- Easy to extend for analytics or AI-driven flows

---

## Component Architecture

src/components/
search/
ArticleCard.tsx
ArticleDetailPanel.tsx
ResultsList.tsx
SearchBar.tsx
SearchHistory.tsx
FiltersBar.tsx
FilterPanel.tsx


### Design Principles
- Small, reusable components
- Clear separation of concerns
- Presentation vs. state logic kept distinct
- Optimized re-renders for performance

---

## Hooks
src/hooks/

Custom hooks encapsulate reusable logic such as:
- Debounced search input
- Search history persistence
- Side panel open/close behavior
- Responsive breakpoint handling

---

## Mock Data

src/mocks/

- Contains mock articles, categories, tags
- Enables realistic demos without backend calls
- Supports pagination, filtering, and sorting

---

## Pages & Layout

src/pages/
SearchPage.tsx


- Main search experience entry point
- Composes layout, search bar, filters, results, and detail panel
- Mobile-aware layout logic

---

## Why This Design Works

- **Backend-independent** → fast iteration
- **Enterprise-ready patterns** → mirrors real production systems
- **UX-focused** → supports customer support workflows
- **Extensible** → AI, analytics, and new modalities can be layered in

---

## Relationship to Other Parts

- **Part 1** — Product & architecture documentation
- **Part 2 (this folder)** — Search UI & frontend architecture
- **Part 3** — API design, Swagger documentation, and metrics

Together, the three parts demonstrate a full-stack product thinking approach.
