<script lang="ts">
  /* eslint-disable @typescript-eslint/no-unsafe-return */
  import client from "$lib/client";

  import Board from "$lib/components/Board.svelte";
  import { onMount } from "svelte";
  import { derived } from "svelte/store";

  let { data } = $props();

  let player = $derived(data.player);
  let game = $derived(data.game);

  onMount(() => {
    void client.gameState($game.id).then((startState) => {
      game = derived([game, startState], ([initial, state]) => {
        if (state) {
          return state;
        }
        return initial;
      });
    });
  });
</script>

<Board game={$game} me={player} />
