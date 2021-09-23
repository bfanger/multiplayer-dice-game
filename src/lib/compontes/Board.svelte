<script lang="ts">
  import type { Game, Player as PlayerType } from "$lib/game-logic/types";
  import { createEventDispatcher } from "svelte";
  import Dice from "./Dice.svelte";
  import Player from "./Player.svelte";

  export let game: Game;
  export let me: PlayerType;

  const dispatch = createEventDispatcher();
</script>

<div>
  {#each game.players as player}
    <Player
      name={player.name}
      avatar={player.avatar}
      active={player.id === game.turn}
    />
  {/each}
</div>
<div>
  {#each game.dices as dice}
    <Dice value={dice.value} />
  {/each}
</div>
{#if !game.turn}
  <button on:click={() => dispatch("start")}>Start game</button>
{:else if game.turn === me.id}
  <button on:click={() => dispatch("throw")}>Throw</button>
{/if}
