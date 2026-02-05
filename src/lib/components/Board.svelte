<script lang="ts">
  /* eslint-disable @typescript-eslint/no-unsafe-call */
  import { flip } from "svelte/animate";
  import client from "$lib/client.svelte";
  import {
    chipPoints,
    chipStack,
    chipStealable,
    totalPoints,
  } from "$lib/game-logic/chip-fns";
  import {
    bankableDiceValues,
    bankedDice,
    bankedDiceValues,
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
  import Chip from "./Chip/Chip.svelte";
  import Dice from "./Dice/Dice.svelte";
  import Player from "./Player.svelte";
  import GameEvents from "./GameEvents.svelte";
  import Toast from "./Toast.svelte";
  import type { ShowToastFn } from "./Toast.svelte";
  import { playerById } from "$lib/game-logic/player-fns";
  import Button from "./Button.svelte";
  import RegisterForm from "./RegisterForm.svelte";
  import { browser } from "$app/environment";
  import Spinner from "./Spinner/Spinner.svelte";
  import Title from "./Title.svelte";
  import { goto } from "$app/navigation";
  import { resolve } from "$app/paths";
  import Stack from "$lib/components/Stack.svelte";
  import { fly } from "svelte/transition";
  import { page } from "$app/state";
  import DiceTray from "./DiceTray.svelte";

  type Props = {
    game: Game;
    me?: PlayerType;
  };
  let { game, me }: Props = $props();
  let hoveredDice = $state<number>();

  let showToast = $state<ShowToastFn>(() => undefined);

  let hoverMultiplier = $derived.by(() => {
    if (!hoveredDice || bankedDiceValues(game.dices).includes(hoveredDice)) {
      return 0;
    }
    if (hoveredDice === 6) {
      return 5;
    }
    return hoveredDice;
  });
  let scoreDelta = $derived(
    game.dices.filter((d) => d.value === hoveredDice).length * hoverMultiplier,
  );

  function chipDisabled(chip: ChipType) {
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
        game.chips.indexOf(chip),
      ) === false
    );
  }
  function getTitle() {
    if (!game.turn) {
      return "Wachten op spelers...";
    }
    if (game.phase === "GAME-OVER") {
      return "Spel is afgelopen";
    }
    const player = game.players.find((p) => p.id === game.turn);
    const subtitle = game.phase === "THROWN" ? "kiezen" : "gooien";
    if (player) {
      return `${player.name} moet ${subtitle}`;
    }
    return subtitle;
  }

  function onTurn(playerId: string) {
    if (playerId === me?.id && game.players.length > 1) {
      showToast("Je bent aan de beurt", 3500);
    }
  }
  function onBust(playerId: string) {
    showToast(
      `Helaas, geen punten${game.players.length > 1 ? ` voor ${playerById(game.players, playerId).name}` : ""}`,
      2500,
    );
  }
  async function joinGame() {
    await client.joinGame(game.id);
  }
  let scores = $derived(
    game.players
      .map((player) => ({
        ...player,
        score: totalPoints(chipStack(game.chips, player.id)),
      }))
      .toSorted((a, b) => b.score - a.score),
  );
  function selectDice(dice: DiceType) {
    if (game.turn !== me?.id || game.phase !== "THROWN") {
      return;
    }
    if (bankableDiceValues(game.dices).includes(dice.value)) {
      void client.bankValue(game.id, dice.value);
      hoveredDice = undefined;
    } else {
      showToast("Dit type dobbelstenen is al gebruikt", 1000);
    }
  }
</script>

<svelte:head>
  <title>{getTitle()}</title>
</svelte:head>

<main class="rows">
  <div class="chips">
    {#each game.chips as chip}
      <span>
        {#if chip.playerId === undefined && !chip.disabled}
          <Chip
            value={chip.value}
            points={chipPoints(chip)}
            disabled={chipDisabled(chip)}
            onclick={() => client.steal(game.id, game.chips.indexOf(chip))}
          />
        {/if}
      </span>
    {/each}
  </div>
  {#if game.players.length === 1 && game.turn}
    {@const stack = chipStack(game.chips, game.players[0].id)}
    {@const total = totalPoints(stack)}
    <div class="solo-stack">
      <Stack chips={stack} />
      <div class="solo-points">
        {total}
        {#if total === 1}punt{:else}punten{/if}
      </div>
    </div>
  {:else}
    <div class="players">
      {#each game.players as player (player.id)}
        <span class:other-player={player.id !== me?.id}>
          <Player
            name={player.name}
            avatar={player.avatar}
            active={player.id === game.turn}
            offline={!player.connected}
            chips={chipStack(game.chips, player.id)}
          />
        </span>
      {/each}
    </div>
  {/if}
  {#if !game.turn}
    {#if me && hasHostAccess(game, me)}
      {#if browser && typeof navigator.share === "function"}
        <Button
          onclick={() => {
            void navigator.share({
              title: "Samen dobbelen",
              text: "Doe je mee?",
              url: page.url.toString(),
            });
          }}
        >
          Nodig anderen uit
        </Button>
      {/if}
      <Button onclick={() => client.startGame(game.id)}>Start spel</Button>
    {:else if !me && browser}
      <div>
        <Title>Meedoen?</Title>
        <RegisterForm onregistered={joinGame} />
      </div>
    {:else}
      <p class="muted">Wacht totdat het spel wordt gestart...</p>
    {/if}
  {:else if game.phase === "GAME-OVER"}
    <ol>
      {#each scores as player (player.id)}
        <li class="highscore">
          {player.name}: <strong>{player.score}</strong> punten
        </li>
      {/each}
    </ol>
    <Button onclick={() => goto(resolve("/"))}>Terug naar start</Button>
  {:else}
    {@const subtotal = diceScoreSubtotal(game.dices)}
    <div class="bank" class:bust={game.phase === "NEW-TURN-BUST"}>
      {#each bankedDice(game.dices) as dice (game.dices.indexOf(dice))}
        <span animate:flip={{ duration: 200 }}>
          <Dice value={dice.value} invalid={hoveredDice === dice.value} />
        </span>
      {/each}
      {#if subtotal > 0 && game.phase !== "NEW-TURN-BUST"}
        <div
          class="score"
          class:valid={diceScoreValid(game.dices) && subtotal >= 21}
        >
          {subtotal}
          {#if scoreDelta > 0}
            <div transition:fly={{ duration: 150, y: -5 }} class="score-delta">
              + {scoreDelta}
            </div>
          {/if}
        </div>
      {/if}
    </div>
    <DiceTray {game} bind:hoveredDice onclick={selectDice} />
    <div class="actions">
      {#if game.turn !== me?.id}
        {#if me}
          {#if game.players.find((p) => p.id === me?.id)}
            <p class="muted">Wachten op andere spelers</p>
          {:else}
            <Button onclick={joinGame}>Meedoen</Button>
          {/if}
        {:else if browser}
          <Title>Meedoen?</Title>
          <RegisterForm onregistered={joinGame} />
        {:else}
          <Spinner />
        {/if}
      {:else if game.turn === me?.id}
        {#if game.phase === "THROWN"}
          Selecteer dobbelstenen
        {:else if game.phase === "NEW-TURN-SUCCESS" || game.phase === "NEW-TURN-BUST" || thrownDice(game.dices).length > 0}
          <Button onclick={() => client.throwDice(game.id)}>
            Gooi dobbelstenen
          </Button>
        {:else}
          Selecteer een chip
        {/if}
      {/if}
    </div>
  {/if}
</main>
<div class="toasts">
  <Toast bind:showToast />
</div>

<GameEvents {game} onbust={onBust} onturn={onTurn} />

<style>
  .rows {
    display: flex;
    flex-direction: column;
    gap: 0.75em;
    align-items: center;

    padding-block: 1.2em;
  }

  .chips,
  .bank,
  .players {
    display: flex;
    flex-wrap: wrap;
    padding-inline: 1.2em;
  }

  .solo-stack {
    display: flex;
    gap: 1rem;
    align-items: center;

    min-height: 6rem;

    font-size: 0.5rem;
  }

  .solo-points {
    font-size: 1rem;
    font-weight: 600;
  }

  .players {
    gap: 1em;
    align-items: center;
  }

  .other-player {
    font-size: 0.7rem;
  }

  .bank {
    --font-size: 0.6em;

    display: flex;
    gap: 0.5rem;
    align-items: center;
    justify-content: center;

    box-sizing: border-box;
    width: 100%;
    min-height: 7.3rem;
    padding: 1.4em 0.5rem;

    background: #92e3e0;

    &.bust {
      background: #f5b0b0;
    }

    @media (width <= 600px) {
      --font-size: 0.4em;
    }
  }

  .score {
    position: relative;

    margin-left: 0.4em;

    font-family: "Poetsen One", sans-serif;
    font-size: 3em;
    line-height: 1;
    color: #14883a;
    text-align: center;
    white-space: nowrap;

    &:not(.valid) {
      color: #930d0d;
    }
  }

  .score-delta {
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translate(-50%, 0);

    padding: 0.1rem 0.5rem;
    border-radius: 2rem;

    font:
      600 1.2rem Dosis,
      sans-serif;
    color: #5a615b;

    background: white;
  }

  .chips {
    display: grid;
    grid-template-columns: repeat(8, 1fr);
    gap: 0.6rem;
    font-size: 0.75rem;

    @media (width <= 600px) {
      gap: 0.5rem;
      font-size: 0.6rem;
    }

    @media (width < 390px) {
      grid-template-columns: repeat(6, 1fr);
    }
  }

  ol {
    padding-inline: 2rem;
  }

  .highscore {
    padding-left: 0.2em;
    font-size: 2em;
  }

  .toasts {
    position: fixed;
    top: 1.2em;
    right: 0;
    left: 0;

    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    align-items: center;
  }

  .muted {
    font-size: 1rem;
    font-weight: 600;
    opacity: 0.5;
  }

  .actions {
    min-height: 2.6rem;
    font-size: 1.2rem;
    font-weight: 600;
  }
</style>
