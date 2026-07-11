<script lang="ts">
  import Stack from "./Stack.svelte";
  import { chipPoints } from "$lib/game-logic/chip-fns";
  import type { Chip as ChipType, Game, Player } from "$lib/game-logic/types";
  import Chip from "./Chip/Chip.svelte";
  import { chipDisabled } from "$lib/game-logic/game-fns";
  import client from "$lib/client.svelte";

  type Props = {
    game: Game;
    me: Player | undefined;
    chips: ChipType[];
  };

  let { chips, game, me }: Props = $props();

  let chip = $derived(chips[0]);
  let stacked = $derived(chips.slice(1));
</script>

<div class="stack">
  {#if chip}
    <Chip
      value={chip.value}
      points={chipPoints(chip)}
      disabled={chipDisabled(game, me, chip)}
      onclick={() => client.steal(game.id, game.chips.indexOf(chip))}
    />
  {/if}
  {#if stacked.length > 0}
    <div class="nested">
      <Stack {game} {me} chips={stacked} />
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
