# Contributing

Any contribution to Flowstruct would be greatly appreciated, including issues, suggestions, pull requests and more.

## Getting started

If you have found a bug, have a suggestion, or something else, just create an issue on GitHub and we can get in touch
🙌.

## Submit a Pull Request

Before you submit the pull request for review please ensure that

- The pull request naming follows the [Conventional Commits specification](https://www.conventionalcommits.org):

  `<type>[optional scope]: <description>`

  example:

  ```
  feat(api): add email sharing
  ```

  When `TYPE` can be:

    - **feat** - is a new feature
    - **docs** - documentation only changes
    - **fix** - a bug fix
    - **refactor** - code change that neither fixes a bug nor adds a feature

- Your pull request has a detailed description

## Development Setup

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

