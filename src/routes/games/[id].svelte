<script lang="ts" context="module">
  import type { Game, Player } from "$lib/game-logic/types";
  import type { Load } from "@sveltejs/kit";
  import { derived, readable, Readable } from "svelte/store";
  import api from "$lib/services/api";
  import client from "$lib/client";

  export const load: Load = async ({ page, fetch }) => {
    const player = await client.me(fetch).catch(() => undefined);
    const $game = await api.get("games/[id].json", {
      params: { id: page.params.id },
      fetch,
    });
    return {
      props: {
        game: readable($game),
        player,
      },
    };
  };
</script>

<script lang="ts">
  import Board from "$lib/compontes/Board.svelte";
  import { onMount } from "svelte";

  export let player: Player | undefined;
  export let game: Readable<Game>;

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
<slot />
