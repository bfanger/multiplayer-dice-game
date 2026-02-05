<script lang="ts">
  import { bankableDiceValues } from "$lib/game-logic/dice-fns";
  import type { Dice as DiceType, Game } from "$lib/game-logic/types";
  import { tick } from "svelte";
  import Dice from "./Dice/Dice.svelte";
  import { shuffle } from "lodash-es";

  type Props = {
    game: Game;
    hoveredDice: number | undefined;
    onclick: (dice: DiceType) => void;
  };
  let { game, hoveredDice = $bindable(), onclick }: Props = $props();
  let roll = $state(true);
  let indexes = $state(
    Array(8)
      .fill(0)
      .map((_, i) => i),
  );
  let rotations = $state(Array(8).fill(0));
  $effect(() => {
    if (game.phase === "THROWN" || game.phase === "NEW-TURN-BUST") {
      // Trigger CSS animation
      roll = false;
      void tick().then(() => {
        indexes = shuffle(indexes);
        rotations = rotations.map(() => Math.floor(Math.random() * 20) - 5);
        roll = true;
      });
    }
  });
</script>

<div class="dice-tray">
  {#each game.dices as _, i (game.dices.indexOf(_))}
    {@const dice = game.dices[indexes[i]]}
    <div>
      {#if !dice.banked && game.phase !== "NEW-TURN-SUCCESS"}
        <div class:roll style:--rotation="{rotations[i]}deg">
          <Dice
            value={dice.value}
            available={game.phase === "THROWN" &&
              bankableDiceValues(game.dices).includes(dice.value)}
            hovered={hoveredDice === dice.value}
            interactive
            onclick={() => onclick(dice)}
            onmouseenter={() => {
              if (game.phase === "THROWN") {
                hoveredDice = dice.value;
              }
            }}
            onmouseleave={() => {
              hoveredDice = undefined;
            }}
          />
        </div>
      {/if}
    </div>
  {/each}
</div>

<style>
  .dice-tray {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: 50% 50%;
    gap: 0.6rem;

    min-height: 9.6rem;
    padding-block: 0.6rem;
  }

  @property --rotation {
    inherits: false;
    initial-value: 0deg;
    syntax: "<angle>";
  }

  .roll {
    --duration: 0.2s;

    opacity: 0;
    animation: dice-roll var(--duration) ease-out forwards;

    &:nth-child(1) {
      animation-delay: calc(var(--duration) * 0.3);
    }

    &:nth-child(2) {
      animation-delay: calc(var(--duration) * 0.2);
    }

    &:nth-child(3) {
      animation-delay: calc(var(--duration) * 0.3);
    }

    &:nth-child(4) {
      animation-delay: calc(var(--duration) * 0.4);
    }

    &:nth-child(5) {
      animation-delay: calc(var(--duration) * 0.15);
    }

    &:nth-child(6) {
      animation-delay: calc(var(--duration) * 0.25);
    }

    &:nth-child(7) {
      animation-delay: calc(var(--duration) * 0.35);
    }

    &:nth-child(8) {
      animation-delay: calc(var(--duration) * 0.45);
    }
  }

  @keyframes dice-roll {
    0% {
      transform: translate(-20px, 10px);
      rotate: -10deg;
      scale: 0.8;
      opacity: 1;
    }

    10% {
      scale: 1;
    }

    100% {
      transform: translate(0, 0);
      rotate: var(--rotation);
      opacity: 1;
    }
  }
</style>
