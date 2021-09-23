<script lang="ts">
  import { player, game } from "$lib/client";
  import Board from "$lib/compontes/Board.svelte";
  import auth from "$lib/stores/auth";
</script>

{#if $auth.ready === false}
  <div>Loading...</div>
{:else if $player}
  {#if $game}
    <Board
      game={$game}
      me={$player}
      on:start={() => game.start()}
      on:throw={() => game.throwDice()}
    />
  {:else}
    <img src={$player.avatar} alt="" />
    <h2>{$player.name}</h2>
    <button on:click={() => game.host()}>Host game</button>
  {/if}
{:else}
  <button on:click={() => auth.login()}>Login</button>
{/if}

<slot />
