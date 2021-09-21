<script lang="ts">
  import { player, socket } from "$lib/client";
  import auth from "$lib/stores/auth";
</script>

{#if $auth.ready === false}
  <div>Loading...</div>
{:else if $socket && $player}
  <pre
    style="white-space:pre-wrap">
    <img src={$player.avatar} alt="" />
    <h2>{$player.name}</h2>
</pre>
{:else}
  <button on:click={() => auth.login()}>Login</button>
{/if}

<slot />
