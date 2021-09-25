<script lang="ts">
  import client from "$lib/client";

  import type { Game, Player as PlayerType } from "$lib/game-logic/types";
  import { onMount } from "svelte";
  import Dice from "./Dice.svelte";
  import Player from "./Player.svelte";

  export let game: Game;
  export let me: PlayerType | undefined = undefined;
  onMount(async () => {
    me = await client.me();
  });
</script>

<div>
  {#each game.players as player (player.id)}
    <Player
      name={player.name}
      avatar={player.avatar}
      active={player.id === game.turn}
      disabled={!player.connected}
    />
  {/each}
</div>
<div>
  {#each game.dices as dice}
    <Dice value={dice.value} />
  {/each}
</div>
{#if !game.turn}
  <button on:click={() => client.startGame(game.id)}>Start spel</button>
{:else if game.turn === me?.id}
  <button on:click={() => client.throwDice(game.id)}>Gooi dobbelstenen </button>
{/if}
