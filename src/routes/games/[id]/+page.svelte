<script lang="ts">
  import client from "$lib/client.svelte.js";
  import Board from "$lib/components/Board.svelte";
  import type { Game } from "$lib/game-logic/types.js";
  import { untrack } from "svelte";

  let { data } = $props();

  const gameState = new client.GameState(untrack(() => data.game as Game));
  let game = $derived(gameState.current);
</script>

{#await client.maybePlayer()}
  <Board {game} />
{:then player}
  <Board {game} me={player} />
{/await}
