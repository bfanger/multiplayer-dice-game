<script lang="ts">
  /* eslint-disable @typescript-eslint/no-unsafe-call */
  import { flip } from "svelte/animate";
  import { crossfade, fade } from "svelte/transition";
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

  type Props = {
    game: Game;
    me?: PlayerType;
  };
  let { game, me }: Props = $props();

  let showToast = $state<ShowToastFn>(() => undefined);

  const [receive, send] = crossfade({ fallback: (node) => fade(node) });
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
  function diceDisabled(dice: DiceType) {
    if (game.turn !== me?.id) {
      return true;
    }
    if (game.phase !== "THROWN") {
      return true;
    }
    return bankableDiceValues(game.dices).includes(dice.value) === false;
  }
  function onTurn(playerId: string) {
    if (playerId === me?.id && game.players.length > 1) {
      showToast("Je bent aan de beurt", 3.5);
    }
  }
  function onBust(playerId: string) {
    showToast(
      `Helaas, geen punten${game.players.length > 1 ? ` voor ${playerById(game.players, playerId).name}` : ""}`,
      2.5,
    );
  }
  async function joinGame() {
    await client.joinGame(game.id);
  }
  let chips = $derived(
    game.chips.filter((chip) => typeof chip.playerId === "undefined"),
  );
  let scores = $derived(
    game.players
      .map((player) => ({
        ...player,
        score: totalPoints(chipStack(game.chips, player.id)),
      }))
      .toSorted((a, b) => b.score - a.score),
  );
</script>

<svelte:head>
  <title>{getTitle()}</title>
</svelte:head>

<main class="rows">
  <div class="chips">
    {#each chips as chip (game.chips.indexOf(chip))}
      <span animate:flip={{ duration: 300 }}>
        <Chip
          value={chip.value}
          points={chipPoints(chip)}
          flipped={!!chip.disabled}
          disabled={chipDisabled(chip)}
          onclick={() => client.steal(game.id, game.chips.indexOf(chip))}
        />
      </span>
    {/each}
  </div>
  <div class="players">
    {#each game.players as player (player.id)}
      <span animate:flip class:other-player={player.id !== me?.id}>
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
  {#if game.phase === "GAME-OVER"}
    <ol>
      {#each scores as player (player.id)}
        <li class="highscore">
          <div>
            {player.name}: <strong>{player.score}</strong> punten
          </div>
        </li>
      {/each}
    </ol>
    <Button onclick={() => goto(resolve("/"))}>Terug naar start</Button>
  {:else}
    {@const subtotal = diceScoreSubtotal(game.dices)}
    <div class="bank">
      {#each bankedDice(game.dices) as dice (game.dices.indexOf(dice))}
        <span
          in:receive={{ key: `dice${game.dices.indexOf(dice)}` }}
          out:send={{ key: `dice${game.dices.indexOf(dice)}` }}
          animate:flip={{ duration: 200 }}
        >
          <Dice value={dice.value} />
        </span>
      {/each}
      {#if subtotal > 0}
        <span
          class="score"
          class:valid={diceScoreValid(game.dices) && game.phase !== "NEW-TURN"}
        >
          {subtotal}
        </span>
      {/if}
    </div>
    <div class="table">
      {#each thrownDice(game.dices) as dice (game.dices.indexOf(dice))}
        <span
          animate:flip={{ duration: 200 }}
          in:receive={{ key: `dice${game.dices.indexOf(dice)}` }}
          out:send={{ key: `dice${game.dices.indexOf(dice)}` }}
        >
          <Dice
            value={dice.value}
            disabled={diceDisabled(dice)}
            onclick={() => client.bankValue(game.id, dice.value)}
          />
        </span>
      {/each}
    </div>
    <div class="actions">
      {#if !game.turn}
        {#if me && hasHostAccess(game, me)}
          <Button onclick={() => client.startGame(game.id)}>Start spel</Button>
        {:else}
          <p class="muted">Wacht todat het spel gestart wordt...</p>
        {/if}
      {:else if game.turn !== me?.id}
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
        {:else if game.phase === "NEW-TURN" || thrownDice(game.dices).length > 0}
          <Button onclick={() => client.throwDice(game.id)}
            >Gooi dobbelstenen
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

  .table,
  .chips,
  .bank,
  .players {
    display: flex;
    flex-wrap: wrap;
    padding-inline: 1.2em;
  }

  .players {
    gap: 1em;
    align-items: center;
  }

  .other-player {
    font-size: 0.7rem;
  }

  .table {
    gap: 1.2em;
    min-height: 4.5rem;
  }

  .bank {
    display: flex;
    gap: 1em;
    justify-content: center;

    box-sizing: border-box;
    width: 100%;
    min-height: 7.3rem;
    padding: 1.4em 0.5rem;

    background: #92e3e0;
  }

  .score {
    font-family: "Poetsen One", sans-serif;
    font-size: 3em;
    color: #14883a;
    text-align: center;

    &:not(.valid) {
      color: #930d0d;
    }
  }

  .chips {
    gap: 0.6em;
    font-size: 0.75rem;

    @media (width <= 600px) {
      gap: 0.4em;
      font-size: 0.5rem;
    }

    @media (width <= 480px) {
      font-size: 0.4rem;
    }

    @media (width <= 420px) {
      font-size: 0.3rem;
    }
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
    opacity: 0.5;
  }

  .actions {
    min-height: 2.6rem;
    font-size: 1.2rem;
    font-weight: 600;
  }
</style>
