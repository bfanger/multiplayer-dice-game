<script lang="ts">
  import { totalPoints } from "$lib/game-logic/chip-fns";

  import type { Chip as ChipType, PlayerAvatar } from "$lib/game-logic/types";
  import Avatar from "./Avatar/Avatar.svelte";
  import Stack from "./Stack.svelte";

  type Props = {
    name: string;
    avatar: PlayerAvatar;
    active?: boolean;
    offline?: boolean;
    chips?: ChipType[];
  };

  let {
    name,
    avatar,
    active = false,
    offline = false,
    chips = [],
  }: Props = $props();

  let points = $derived(totalPoints(chips));
</script>

<div class="player" class:active class:offline>
  <Avatar {avatar} />
  {#if offline}
    <div class="label">Offline</div>
  {:else}
    <div class="name">{name}</div>
  {/if}
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

    padding: 0.25rem;
    border-radius: 1rem;

    &.offline {
      opacity: 0.4;
      filter: grayscale(100%);
    }
  }

  .name {
    padding: 0.2em 0.6em;
    border-radius: 2em;
    font-weight: bold;
    transition: transform 0.2s;

    .active & {
      transform: translateY(0.2rem);
      color: white;
      background-color: var(--color-text);
    }
  }

  .label {
    padding: 0.2em 0.6em;
    font-weight: bold;
  }

  .chips {
    position: absolute;
    top: -1rem;
    right: -1.6rem;
    transform: scale(0.6);
  }
</style>
