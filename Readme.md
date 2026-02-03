# Online Multiplayer Dice game

Playable at https://dice-game.bfanger.nl/

Inspired by a physical dice game which we play at the office during lunch breaks.
The game was created during covid, to allow us to play the game online.

## Technology

- [Redis](https://redis.io/) to store game state and provide pubsub events
- [Socket.IO](https://socket.io/) for syncing gamestate between clients
- [SvelteKit](https://svelte.dev/) with a custom node server & vite setup to enable websockets support.

## Local setup (macOS)

```sh
brew install redis
brew services start redis
pnpm install

pnpm run dev
```

Open http://localhost:5173/ in your browser.
