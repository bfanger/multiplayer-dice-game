<script lang="ts">
  import client from "$lib/client";
  import { chipPoints } from "$lib/game-logic/chip-fns";
  import {
    bankedDice,
    diceScoreSum,
    thrownDice,
  } from "$lib/game-logic/dice-fns";
  import { hasHostAccess } from "$lib/game-logic/game-fns";

  import type { Game, Player as PlayerType } from "$lib/game-logic/types";
  import { onMount } from "svelte";
  import Chip from "./Chip.svelte";
  import Dice from "./Dice.svelte";
  import Player from "./Player.svelte";

  export let game: Game;
  export let me: PlayerType | undefined = undefined;

  $: chips = game.chips.filter((chip) => typeof chip.playerId === "undefined");

  onMount(async () => {
    me = await client.me();
  });
</script>

<main class="rows">
  <div class="chips">
    {#each chips as chip}
      <Chip
        value={chip.value}
        points={chipPoints(chip)}
        flipped={!chip.disabled}
      />
    {/each}
  </div>
  <div class="players">
    {#each game.players as player (player.id)}
      <Player
        name={player.name}
        avatar={player.avatar}
        active={player.id === game.turn}
        disabled={!player.connected}
      />
    {/each}
  </div>

  <div class="bank">
    {#each bankedDice(game.dices) as dice}
      <Dice value={dice.value} />
    {/each}
    <span class="score">{diceScoreSum(game.dices)}</span>
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
</main>
<dl>
  <dt>Fase</dt>
  <dd>{game.phase}</dd>
</dl>

<style lang="scss">
  .rows {
    padding: 1.6rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.2rem;
  }
  .table,
  .chips,
  .bank,
  .players {
    display: flex;
    flex-wrap: wrap;
  }
  .table {
    gap: 1.2rem;
  }

  .bank {
    background: #072e14;
    border: 2px solid silver;
    min-height: 6rem;
    min-width: 6rem;
    padding: 1.5rem;
    border-radius: 2rem;
    gap: 1.2rem;
  }
  .score {
    min-width: 6rem;
    color: #32a85a;
    font: bold 3rem sans-serif;
    line-height: 6rem;
    text-align: center;
  }

  .chips,
  .players {
    gap: 0.6rem;
  }
</style>
