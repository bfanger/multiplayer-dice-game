<script lang="ts">
  import { chipPoints } from "$lib/game-logic/chip-fns";
  import type { Chip as ChipType } from "$lib/game-logic/types";
  import Chip from "./Chip.svelte";

  export let chips: ChipType[];

  $: chip = chips[0];
  $: stacked = chips.slice(1);
</script>

<div class="stack">
  {#if chip}
    <Chip value={chip.value} points={chipPoints(chip)} />
  {/if}
  {#if stacked.length > 0}
    <div class="nested">
      <svelte:self chips={stacked} nested />
    </div>
  {/if}
</div>

<style lang="scss">
  .stack {
    position: relative;
  }
  .nested {
    position: absolute;
    top: 0.4rem;
    right: 0.3rem;
    border-radius: 0.6rem;
    box-shadow: 0 0 2px rgba(#473616, 0.5);
  }
</style>
