<script lang="ts">
  import { totalPoints } from "$lib/game-logic/chip-fns";

  import type { Chip as ChipType } from "$lib/game-logic/types";
  import Stack from "./Stack.svelte";

  type Props = {
    name: string;
    avatar: string;
    active?: boolean;
    disabled?: boolean;
    chips?: ChipType[];
  };

  let {
    name,
    avatar,
    active = false,
    disabled = false,
    chips = [],
  }: Props = $props();

  let points = $derived(totalPoints(chips));
</script>

<div class="player" class:active class:disabled>
  <img class="avatar" src={avatar} alt="" />
  <span>{name}</span>
  <div class="chips" title="{points} points">
    <Stack {chips} />
  </div>
</div>

<style>
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
  .chips {
    position: absolute;
    top: -1rem;
    right: -1rem;
    transform: scale(0.85);
  }
</style>
