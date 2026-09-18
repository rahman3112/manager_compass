# Manager Compass

A guided first step for people managers facing an HR situation — grounded entirely in real,
approved RealPage documents. Built for the RealPage Internal Hackathon by **Team MC-02**.

Manager Compass is a navigation layer, not a decision-maker: it points a manager to the right
approved document, drafts a starting plan, and knows exactly when to hand things to a person
instead. There is no language model anywhere in the stack — every guide is retrieved from a
curated, pre-approved content set, so it can't invent a policy, a document, or a contact that
wasn't already vetted.

## What's built

| Screen | What it does |
|---|---|
| **Home** | Category tiles that jump straight into Compass's specifics step. |
| **Compass** | A 3-step wizard — category, specifics, prepare — with a US / Philippines / Global country filter. Ends in a concrete first step, a prep checklist, real source documents, and an escalation contact. |
| **Plans** | Every generated guide can be saved as a Plan with an editable Tasks checklist, tracked on a dashboard of open/overdue/due-soon items. |
| **Resources** | Every real approved document (55 across 4 categories), grouped by category and subfolder, shown in full by default. |
| **How it works** | An in-app explainer of the pitch and the end-to-end flow. |

**Guardrails:** a hard keyword gate runs before any guide is built. Harassment, threats,
discrimination, or self-harm language routes straight to Employee Relations — no steps, no
documents, no guessing. The app never gives legal advice, makes pay/comp or disciplinary
decisions, or invents a policy that doesn't exist.

Site-wide dark/light theme toggle (persisted to `localStorage`), and each top-level view is
wrapped in its own error boundary so a render failure in one tab can't blank the rest of the app.

## Tech stack

- **Frontend**: React 19 + TypeScript on Vite. No UI framework — a custom CSS design system
  driven by `:root` tokens.
- **Backend**: ASP.NET Core Web API on .NET 10. Controller → Service → curated JSON content
  pattern. Plans/Tasks persist to disk as JSON (fine for a demo; see [Known limitations](#known-limitations)).
- **Deployment**: a single multi-stage `Dockerfile` builds the frontend and serves it from the
  backend at the same origin — no CORS or split-hosting config needed in production.

## Project structure

```
realpage_mc/
├── Dockerfile                          # single-image build: frontend + backend
├── backend/ManagerCompass.Api/
│   ├── Controllers/                    # Guide, Categories, Scenarios, Plans, Tasks, Resources
│   ├── Services/                       # SituationService, GuardrailService, PlanService,
│   │                                   #   TaskService, ResourceLibraryService
│   ├── Models/
│   └── Assets/
│       ├── raw/                        # real source documents (55 across 4 categories)
│       └── processed/                  # situations.json, contacts.json, keywords.json
└── frontend/
    └── src/
        ├── components/                 # HomeView, CompassView, TasksView, ResourcesView, ...
        ├── api/client.ts                # talks to the backend API
        └── types/
```

## Getting started

### Prerequisites

- [.NET 10 SDK](https://dotnet.microsoft.com/download)
- [Node.js](https://nodejs.org/) 20+

### Backend

```bash
cd backend/ManagerCompass.Api
dotnet run --launch-profile http
```

Runs at `http://localhost:5171`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Runs at `http://localhost:5173` and talks to the backend at `http://localhost:5171` in dev
(override with `VITE_API_BASE_URL`). CORS is already open for any loopback origin in
development.

## Deployment

The root `Dockerfile` builds the frontend, publishes the backend, and copies the frontend's
build output into the backend's `wwwroot`, so the whole app ships and serves as one image on one
origin.

```bash
docker build -t manager-compass .
docker run -p 8080:8080 manager-compass
```

To deploy on [Render](https://render.com): **New → Web Service**, connect this repo, environment
**Docker**, instance type Free. No build/start command or environment variables needed — the
Dockerfile handles it, and Render auto-detects the exposed port (8080). Every push to `main`
auto-redeploys.

## Content library

- **5** Compass categories: Payroll, Benefits, Handbook & Policies, Talent & Development, Talent
  Services.
- **23** pre-built scenario checkboxes across those categories.
- **55** real approved documents in the Resources browser, across 4 real source folders:
  Handbook & Policies, Training & Development, Employee Relations & Guardrails, and Talent
  Services & Intake Routing.
- Country-aware content: **US**, **Philippines**, and **Global**.

## Known limitations

- **Persistence**: Plans and Tasks are file-backed JSON (`Assets/processed/plans.json` /
  `tasks.json`), which resets on redeploy. A pilot would move this to a real database.
- **Coverage**: Payroll and Benefits have no real source documents anywhere in this repo — their
  scenario checkboxes exist but link to files that don't actually exist on disk. New checkboxes
  were deliberately not added to those two categories for that reason.
- **Matching**: free-text input (when no checkbox is picked) is matched by keyword scoring, not
  language understanding — deliberately, to keep every match traceable and explainable.
- **Scope**: country-aware content currently covers US and Philippines; extending to other
  RealPage regions is a content task, not a rebuild.

## Team

**Team MC-02**

- ShynenJoy Abanador
- Tobi Ferrer
- Ashish Komuravelly
- Saima Tasneem Saherwardi
- Mohammed Abdul Rahman
