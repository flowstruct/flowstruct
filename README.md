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

Flowstruct is a self-hosted visualization tool that transforms university course catalogs into interactive flowsheets, making curriculum structures beautifully clear and navigable. 
Click any course to instantly see its full prerequisite chain and what it unlocks. Down with the long, complicated PDFs! 
<br/>

→ Try out the [Demo](https://gjuplans.com/study-plans/1)

## ✨ Features

### Curriculum visualization (content pages)

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

### Additional features

- Easily rollback content changes (changes are not shown publicly unless approved by a publisher)
- Built-in RBAC with specific privileges to streamline workflows (Editor, Publisher, Guest, Admin)
- Content pages automatically calculate their indirect pre/postrequisites, you only define direct prerequisites

## ⌨️ Getting Started

> **IMPORTANT!** Flowstruct is currently in beta, expect breaking changes before v1.0

### Installation (using Docker)

1. Download the `compose.yml` file
2. Run `docker compose up -d`

### Accessing the application

The application is accessible through the following URLs:

| Service | URL                                                |
|---------|----------------------------------------------------|
| Content | [http://localhost:3000](http://localhost:4321)     |
| CMS     | [http://localhost:3000/cms](http://localhost:5173) |
| API     | [http://localhost:3000/api](http://localhost:8080) |

#### CMS login  

An **admin account** is available for accessing the CMS:  

- **Username:** `flowstruct`  
- **Password:** `flowstruct`  

That's all. Have fun with Flowstruct! 🌊

## ⚙️ Configuration

Flowstruct can be configured using the following environment variables:

| Variable                               | Default Value | Description                                                                                                                                                                                                                                                                                                                                                      |
|----------------------------------------|---------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `TRUST_PROXY`                          | `false`       | Whether Flowstruct is behind a reverse proxy.                                                                                                                                                                                                                                                                                                                    |
| `PUID` and `PGID`                      | `1000`        | The user and group ID of the user who should run Docker inside the Docker container and owns the files that are mounted with the volume. You can get the PUID and GUID of your user on your host machine by using the command id. For more information see [this article](https://docs.linuxserver.io/general/understanding-puid-and-pgid/#using-the-variables). |
| `DB_NAME`, `DB_USER` and `DB_PASSWORD` | `flowstruct`  | Name, user, and password to the PostgreSQL database.                                                                                                                                                                                                                                                                                                             |
