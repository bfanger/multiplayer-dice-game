<script lang="ts">
  import Stack from "./Stack.svelte";
  import { chipPoints } from "$lib/game-logic/chip-fns";
  import type { Chip as ChipType } from "$lib/game-logic/types";
  import Chip from "./Chip/Chip.svelte";

  type Props = {
    chips: ChipType[];
  };

  let { chips }: Props = $props();

  let chip = $derived(chips[0]);
  let stacked = $derived(chips.slice(1));
</script>

<div class="stack">
  {#if chip}
    <Chip value={chip.value} points={chipPoints(chip)} />
  {/if}
  {#if stacked.length > 0}
    <div class="nested">
      <Stack chips={stacked} />
    </div>
  {/if}
</div>

<style>
  .stack {
    position: relative;
  }

  .nested {
    position: absolute;
    top: 0.4rem;
    right: 0.3rem;

    border-radius: 0.6rem;

    box-shadow: 0 0 2px rgb(71 54 22 / 50%);
  }
</style>
