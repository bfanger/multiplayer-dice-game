<script lang="ts">
  import client from "$lib/client";

  import Board from "$lib/components/Board.svelte";
  import { onMount } from "svelte";
  import { derived } from "svelte/store";
  import type { PageData } from "./$types";

  export let data: PageData;

  $: player = data.player;
  $: game = data.game;

  onMount(() => {
    client.gameState($game.id).then((state) => {
      game = derived([game, state], ([initial, state]) => {
        if (state) {
          return state;
        }
        return initial;
      });
    });
  });
</script>

<Board game={$game} me={player} />
