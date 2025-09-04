# <div align="center"><img src="/assets/logo.svg" width="100"><br/>Flowstruct</div>

<p align="center">
  <a href="https://github.com/flowstruct/flowstruct/releases">
    <img src="https://img.shields.io/github/v/release/flowstruct/flowstruct" alt="Release">
  </a>
  <a href="https://github.com/flowstruct/flowstruct/actions">
    <img src="https://img.shields.io/github/actions/workflow/status/flowstruct/flowstruct/ci.yml" alt="Build Status">
  </a>
  <a href="https://github.com/flowstruct/flowstruct/blob/main/LICENSE">
    <img src="https://img.shields.io/github/license/flowstruct/flowstruct" alt="License">
  </a>
  <img src="https://img.shields.io/badge/contributions-welcome-brightgreen.svg" alt="Contributions welcome">
</p>

Flowstruct is a university curriculum CMS that turns complex course dependencies into interactive, easy-to-read pages.
Down with the long, complicated PDFs!
<br/>

→ Try out the [Demo](https://gjuplans.com/study-plans/1)

---

## Features

### Curriculum Visualization (Content Pages)

Generate dynamic pages that highlight course dependency chains (automatically) with clear visual markers:

![Content Demo](/assets/content-demo.png)

| Color           | Meaning                 | Indicator |
|-----------------|-------------------------|-----------|
| 🟨 (yellow)     | Indirect prerequisites  | 🡸 🡸     |
| 🟧 (orange)     | Direct prerequisites    | 🡸        |
| 🔷 (light blue) | Selected course         |           |
| 🔵 (dark blue)  | Indirect postrequisites | 🡺 🡺     |

### Content Editor (CMS)

A content management system designed to manage the structure of the generated pages:

![CMS Demo 1](/assets/cms-demo-1.png)

Automatic prerequisite validation checks when moving, adding, or removing courses from the content page:

![CMS Demo 2](/assets/cms-demo-2.png)

### Additional Features

- Easily rollback content changes (changes are not shown publicly unless approved by a publisher)
- Built-in RBAC with specific privileges to streamline workflows (Editor, Publisher, Guest, Admin)
- Content pages automatically calculate their indirect pre/postrequisites, you only define direct prerequisites

---

## Quick Start (Coming Soon)

We’re working on a single `docker-compose.yml` that will let you run the full
production-ready stack with one command:

```bash
docker compose up -d
```

---

## Setup

> **IMPORTANT!** Flowstruct is currently in beta, expect breaking changes before v1.0

### Prerequisites

- Node.js (v20)
- Java 20
- PostgreSQL 16.9 (local install or via Docker)

### Getting Started

Flowstruct consists of two frontends (Content, CMS) and a backend + database.
In production, the CMS is built and statically served,
while the content uses server-side rendering (SSR) via a Node.js runtime to serve the content pages.
The backend requires a Java runtime to serve responses to both frontends.

### Backend

The backend is a Spring Boot application that connects to a PostgreSQL database (on port 5433).

> Use ``Docker`` for running the database, as it makes it easy to wipe volumes if you’re planning schema-level
> changes.

1. Navigate to the ``api`` folder
2. Run ``docker compose up -d`` to start the database
3. Configure Spring Boot to use the ``dev`` profile
4. Run `` mvn spring-boot:run`` to start the backend

### Frontend (CMS)

The CMS is built using React + Vite and written in TypeScript

1. Navigate to the ``client`` folder
2. Run ``pnpm install`` to install dependencies (across both frontends)
3. Run ```pnpm start:cms``` to start the CMS

### Frontend (Content)

The content uses server-side rendering (SSR) via a Node.js runtime to serve the content pages.

1. Navigate to the ``client`` folder
2. Run ``pnpm install`` (if you haven't already from before)
3. Run ```pnpm start:content``` to start the content server

### Access the Application

| Service | URL                                            |
|---------|------------------------------------------------|
| Content | [http://localhost:4321](http://localhost:4321) |
| CMS     | [http://localhost:5173](http://localhost:5173) |
| API     | [http://localhost:8080](http://localhost:8080) |