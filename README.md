<div align="center">
<pre>
 ██████╗ ██████╗ ██╗     ██╗      █████╗ ██████╗  ██████╗ ██████╗ ███████╗██████╗ 
██╔════╝██╔═══██╗██║     ██║     ██╔══██╗██╔══██╗██╔═══██╗██╔══██╗██╔════╝██╔══██╗
██║     ██║   ██║██║     ██║     ███████║██████╔╝██║   ██║██████╔╝█████╗  ██████╔╝
██║     ██║   ██║██║     ██║     ██╔══██║██╔══██╗██║   ██║██╔══██╗██╔══╝  ██╔══██╗
╚██████╗╚██████╔╝███████╗███████╗██║  ██║██████╔╝╚██████╔╝██║  ██║███████╗██║  ██║
 ╚═════╝ ╚═════╝ ╚══════╝╚══════╝╚═╝  ╚═╝╚═════╝  ╚═════╝ ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝
</pre>

**Real-time collaborative code editing. No accounts. No friction. Just share a room and code.**

[**Live Demo →**](https://collaborer-production.up.railway.app)

![Node](https://img.shields.io/badge/node-%3E%3D18-yellow)
![Built with Yjs](https://img.shields.io/badge/built%20with-Yjs-purple)
![Deployed on Railway](https://img.shields.io/badge/deployed%20on-Railway-black)

</div>

---

## What is Collaborer?

A real-time collaborative code editor. Create a room, share the link, and everyone who joins edits the same file simultaneously — live cursors, syntax highlighting, code execution, no login required.

Spun off from a larger online judge project when the collaborative editing piece felt like it deserved its own repo.

---

## Features

- **No auth** — enter a room ID and a name, start coding immediately
- **Live cursors** — every collaborator's cursor tracked in real time, each with a distinct color and floating name tag
- **Room isolation** — each room is fully sandboxed, users across rooms share zero state
- **CRDT sync** — built on Yjs so simultaneous edits merge correctly without overwriting anyone's changes
- **Code execution** — run code directly in the editor via Glot.io, with stdin support
- **Monaco editor** — same engine as VS Code, with the brogrammer dark theme

---

## The Yjs Migration

The first version used **Express + PostgreSQL + Redis + BullMQ** — document state in Postgres, updates queued through BullMQ and broadcast via Redis pub/sub.

It mostly worked, except for one annoying bug: remote cursors would snap back to position 0 on every update. The root cause was `setValue()` — the way remote content was being applied to Monaco destroys and recreates the editor model, wiping all cursor decorations in the process.

The fix wasn't a patch. Manually diffing and syncing text was fighting against how collaborative editors need to work. Switched to **Yjs** with `y-monaco` as the binding layer — Monaco's model is now driven directly by a `Y.Text` CRDT, so cursor positions are anchored to logical document positions rather than raw character offsets. Cursors haven't reset since. The Redis/BullMQ layer came out entirely.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Editor | Monaco Editor |
| Sync | Yjs, y-websocket, y-monaco |
| Backend | Node.js, Express |
| Execution | Glot.io API |
| Deployment | Railway |

---

## Local Setup

```bash
git clone https://github.com/adiKr07/collaborer.git
cd collaborer
npm install
```

Create a `.env` file:

```env
PORT=3000
GLOT_TOKEN=your_glot_token_here
```

```bash
npm run dev
```

Open `http://localhost:3000`, enter a room name, share the URL.

---

## Deployment

Deployed on Railway. Add the following environment variable in your Railway service settings:

```
GLOT_TOKEN=your_glot_token_here
```

---

## Roadmap

- [ ] Persistent rooms
- [ ] File tabs within a room
- [ ] Language selector synced across users
- [ ] Read-only spectator mode
