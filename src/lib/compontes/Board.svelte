<script lang="ts">
  import client from "$lib/client";
  import {
    bankedDice,
    diceScoreSum,
    thrownDice,
  } from "$lib/game-logic/dice-fns";
  import { hasHostAccess } from "$lib/game-logic/game-fns";

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
<dl>
  <dt>Fase</dt>
  <dd>{game.phase}</dd>
  <dt>Score</dt>
  <dd>{diceScoreSum(game.dices)}</dd>
</dl>
<div class="bank">
  {#each bankedDice(game.dices) as dice}
    <Dice value={dice.value} />
  {/each}
</div>
<div class="table">
  {#each thrownDice(game.dices) as dice}
    <Dice
      value={dice.value}
      on:click={() => client.bankValue(game.id, dice.value)}
    />
  {/each}
</div>

{#if !game.turn}
  {#if me && hasHostAccess(game, me)}
    <button on:click={() => client.startGame(game.id)}>Start spel</button>
  {:else}
    <p>Wacht todat het spel gestart wordt</p>
  {/if}
{:else if game.turn === me?.id}
  {#if game.phase === "THROWN"}
    Selecteer dobbelstenen
  {:else if game.phase === "BEGIN" || thrownDice(game.dices).length > 0}
    <button on:click={() => client.throwDice(game.id)}
      >Gooi dobbelstenen
    </button>
  {:else}
    Select chip
  {/if}
{/if}

<style lang="scss">
  .bank {
    background: rgb(7, 46, 20);
    border: 2px solid silver;
    min-height: 6rem;
    padding: 2rem;
    border-radius: 2rem;
  }
</style>
