<script lang="ts">
  import { gameEvents } from "$lib/game-logic/game-fns";
  import type { Game } from "$lib/game-logic/types";
  import { createEventDispatcher } from "svelte";

  export let game: Game;

  const dispatch = createEventDispatcher();

  let previous: Game | undefined;
  function detectEvent(next: Game) {
    if (!previous) {
      previous = next;
      return;
    }
    const events = gameEvents(next, previous);
    previous = next;

    for (const event of events) {
      if (event.type === "bust" || event.type === "turn") {
        dispatch(event.type, event.playerId);
      } else {
        dispatch(event.type);
      }
    }
  }
  $: detectEvent(game);
</script>
