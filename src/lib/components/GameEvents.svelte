<script lang="ts">
  import { gameEvents } from "$lib/game-logic/game-fns";
  import type { Game } from "$lib/game-logic/types";

  type Props = {
    game: Game;
    onbust?: (playerId: string) => void;
    onturn?: (playerId: string) => void;
  };

  let { game, onbust, onturn }: Props = $props();

  let previous: Game | undefined;

  function detectEvent(next: Game) {
    if (!previous) {
      previous = next;
      return;
    }
    const events = gameEvents(next, previous);
    previous = next;

    for (const event of events) {
      if (event.type === "bust") {
        onbust?.(event.playerId);
      } else if (event.type === "turn") {
        onturn?.(event.playerId);
      } else if (event.type === "start" || event.type === "gameover") {
        // No-op for now
      } else {
        console.warn("Unknown event type:", event.type);
      }
    }
  }
  $effect(() => {
    detectEvent(game);
  });
</script>
