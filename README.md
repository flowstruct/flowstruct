# <div align="center"><img src="/assets/logo.png" width="750"></div>

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

Flowstruct is a self-hosted content management system that transforms university course catalogs into interactive flowsheets, making curriculum structures clear and navigable. 
Click any course to instantly see its full prerequisite chain and what it unlocks. Down with the long, complicated PDFs! 
<br/>

→ Try out a [page](https://gjuplans.com/study-plans/1)

![Content Demo](/assets/content-demo.png)

| Color           | Meaning                 | Indicator |
|-----------------|-------------------------|-----------|
| 🟨      | Indirect prerequisites  | ⬅️⬅️     |
| 🟧     | Direct prerequisites    | ⬅️        |
| 🔷  | Selected course         |           |
| 🔵   | Indirect postrequisites | ➡️➡️     |

## Features
- Self-hostable content management system to generate curriculum flowsheets
- Mobile-friendly flowsheet pages (customizable icon + title)
- Flowsheets automatically calculate their indirect pre/postrequisites, you only define direct prerequisites
- Automatic correction of prerequisite ordering when moving, adding, or removing courses
- Easily rollback changes (draft/approve workflow)
- Different levels of access (Editor, Publisher, Guest, Admin)

## Gallery
![CMS demo 1](/assets/cms-demo-1.png)
![CMS demo 2](/assets/cms-demo-2.png)
![CMS demo 3](/assets/cms-demo-3.png)

## Getting started

> **IMPORTANT!** Flowstruct is currently in beta, expect breaking changes before v1.0

### Installation (using Docker)

1. Download the `compose.yml` file
2. Run `docker compose up -d`
3. Access the app through [http://localhost:3000](http://localhost:3000)

#### CMS login

An **admin account** is available for accessing the CMS:  

- **Username:** `flowstruct`  
- **Password:** `flowstruct`  

#### Generating pages

1. Create a flowsheet
2. head to `Generate site`, and download the website you generated
3. Host the downloaded folder on Cloudflare, Netlify, Vercel (or any platform that supports static website hosting)

That's all. Have fun with Flowstruct! 🌊

## Configuration

Flowstruct can be configured using the following environment variables:

| Variable                               | Default Value | Description                                                                                                                                                                                                                                                                                                                                                      |
|----------------------------------------|---------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `TRUST_PROXY`                          | `false`       | Whether Flowstruct is behind a reverse proxy.                                                                                                                                                                                                                                                                                                                    |
| `PUID` and `PGID`                      | `1000`        | The user and group ID of the user who should run Docker inside the Docker container and owns the files that are mounted with the volume. You can get the PUID and GUID of your user on your host machine by using the command id. For more information see [this article](https://docs.linuxserver.io/general/understanding-puid-and-pgid/#using-the-variables). |
| `DB_NAME`, `DB_USER` and `DB_PASSWORD` | `flowstruct`  | Name, user, and password to the PostgreSQL database.                                                                                                                                                                                                                                                                                                             |
