<script lang="ts">
  import { onMount } from "svelte";
  import { flip } from "svelte/animate";
  import { crossfade, fade } from "svelte/transition";
  import { sortBy, groupBy } from "lodash-es";
  import client from "$lib/client";
  import {
    chipPoints,
    chipStack,
    chipStealable,
    totalPoints,
  } from "$lib/game-logic/chip-fns";
  import {
    bankableDiceValues,
    bankedDice,
    diceScoreSubtotal,
    diceScoreTotal,
    diceScoreValid,
    thrownDice,
  } from "$lib/game-logic/dice-fns";
  import { hasHostAccess } from "$lib/game-logic/game-fns";
  import type {
    Game,
    Player as PlayerType,
    Chip as ChipType,
    Dice as DiceType,
  } from "$lib/game-logic/types";
  import Chip from "./Chip.svelte";
  import Dice from "./Dice.svelte";
  import Player from "./Player.svelte";

  export let game: Game;
  export let me: PlayerType | undefined = undefined;

  $: chips = game.chips.filter((chip) => typeof chip.playerId === "undefined");
  $: scores = sortBy(
    game.players.map((player) => ({
      ...player,
      score: totalPoints(chipStack(game.chips, player.id)),
    })),
    "score",
    "desc"
  );
  $: title = getTitle(game);

  const [receive, send] = crossfade({ fallback: (node) => fade(node) });
  onMount(async () => {
    me = await client.me();
  });
  function chipDisabled(game: Game, chip: ChipType) {
    if (game.phase !== "BANKED") {
      return true;
    }
    if (!me) {
      return true;
    }
    if (game.turn !== me.id) {
      return true;
    }
    return (
      chipStealable(
        game.chips,
        me.id,
        diceScoreTotal(game.dices),
        game.chips.indexOf(chip)
      ) === false
    );
  }
  function getTitle(game: Game) {
    if (!game.turn) {
      return "Wachten op spelers...";
    }
    if (game.phase === "GAME-OVER") {
      return "Spel is afgelopen";
    }
    const player = game.players.find((p) => p.id === game.turn);
    const subtitle = game.phase === "THROWN" ? "kiezen" : "gooien";
    if (player) {
      return player.name + " moet " + subtitle;
    }
    return subtitle;
  }
  function diceDisabled(game: Game, dice: DiceType) {
    if (game.turn !== me?.id) {
      return true;
    }
    if (game.phase !== "THROWN") {
      return true;
    }
    return bankableDiceValues(game.dices).includes(dice.value) === false;
  }
</script>

<svelte:head>
  <title>{title}</title>
</svelte:head>

<main class="rows">
  <div class="chips">
    {#each chips as chip (game.chips.indexOf(chip))}
      <span animate:flip={{ duration: 300 }}>
        <Chip
          value={chip.value}
          points={chipPoints(chip)}
          flipped={!!chip.disabled}
          disabled={chipDisabled(game, chip)}
          on:click={() => client.steal(game.id, game.chips.indexOf(chip))}
        />
      </span>
    {/each}
  </div>
  <div class="players">
    {#each game.players as player (player.id)}
      <Player
        name={player.name}
        avatar={player.avatar}
        active={player.id === game.turn}
        disabled={!player.connected}
        chips={chipStack(game.chips, player.id)}
      />
    {/each}
  </div>
  {#if game.phase === "GAME-OVER"}
    <ol>
      {#each Object.values(groupBy(scores, "score")) as rank}
        <li class="highscore">
          {#each rank as player (player.id)}
            <div>
              {player.name}: <strong>{player.score}</strong> punten
            </div>
          {/each}
        </li>
      {/each}
    </ol>
  {:else}
    <div class="bank">
      {#each bankedDice(game.dices) as dice (game.dices.indexOf(dice))}
        <span
          in:receive={{ key: "dice" + game.dices.indexOf(dice) }}
          out:send={{ key: "dice" + game.dices.indexOf(dice) }}
          animate:flip={{ duration: 200 }}
        >
          <Dice value={dice.value} />
        </span>
      {/each}
      <span
        class="score"
        class:valid={diceScoreValid(game.dices) && game.phase !== "NEW-TURN"}
        >{diceScoreSubtotal(game.dices)}</span
      >
    </div>
    <div class="table">
      {#each thrownDice(game.dices) as dice (game.dices.indexOf(dice))}
        <span
          animate:flip={{ duration: 200 }}
          in:receive={{ key: "dice" + game.dices.indexOf(dice) }}
          out:send={{ key: "dice" + game.dices.indexOf(dice) }}
        >
          <Dice
            value={dice.value}
            disabled={diceDisabled(game, dice)}
            on:click={() => client.bankValue(game.id, dice.value)}
          />
        </span>
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
      {:else if game.phase === "NEW-TURN" || thrownDice(game.dices).length > 0}
        <button on:click={() => client.throwDice(game.id)}
          >Gooi dobbelstenen
        </button>
      {:else}
        Select chip
      {/if}
    {/if}
  {/if}
</main>

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
    color: #3ad36d;
    font: bold 3rem sans-serif;
    line-height: 6rem;
    text-align: center;
    &:not(.valid) {
      color: #8d8d8d;
    }
  }

  .chips,
  .players {
    gap: 0.6rem;
  }
  .highscore {
    font-size: 2.8rem;
    padding-left: 2rem;
  }
</style>
