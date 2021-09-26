<script lang="ts">
  import { chipPoints } from "$lib/game-logic/chip-fns";
  import type { Chip as ChipType } from "$lib/game-logic/types";
  import Chip from "./Chip.svelte";

  export let name: string;
  export let avatar: string;
  export let active = false;
  export let disabled = false;
  export let stack: ChipType[] = [];
  $: chips = [...stack].reverse().slice(0, 2).reverse();
</script>

<div class="player" class:active class:disabled>
  <img class="avatar" src={avatar} alt="" />
  <span>{name}</span>
  <div class="stack">
    {#each chips as chip}
      <div class="chip">
        <Chip value={chip.value} points={chipPoints(chip)} />
      </div>{/each}
  </div>
</div>

<style lang="scss">
  .player {
    position: relative;
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    font-size: 1.3rem;
    background-color: rgb(12, 87, 12);
    padding: 1rem;
    border-radius: 2rem;
    &.active {
      background-color: white;
      color: black;
      font-weight: bold;
    }
    &.disabled {
      opacity: 0.5;
    }
  }
  .avatar {
    border-radius: 50%;
    width: 8rem;
    height: 8rem;
    object-fit: cover;
    margin-bottom: 1rem;
  }
  .stack {
    position: absolute;
    top: -0.5rem;
    right: -0.5rem;
  }
  .chip {
    position: absolute;
    right: 0;
    transform: scale(0.8);
    transform-origin: top right;
    &:nth-child(1) {
      top: 0rem;
      right: 0.4rem;
    }
    &:nth-child(2) {
      top: 0.5rem;
      right: 0.2rem;
    }
    &:nth-child(3) {
      top: 1rem;
      right: 0;
    }
  }
</style>
