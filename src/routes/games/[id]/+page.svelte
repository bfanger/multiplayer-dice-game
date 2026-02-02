<script lang="ts">
  import { goto } from "$app/navigation";
  import { resolve } from "$app/paths";
  import client from "$lib/client.svelte.js";
  import Board from "$lib/components/Board.svelte";
  import Button from "$lib/components/Button.svelte";
  import Modal from "$lib/components/Modal.svelte";
  import Title from "$lib/components/Title.svelte";

  let { data } = $props();

  let gameState = $derived(new client.GameState(data.game));
  let game = $derived(gameState.current);
</script>

<Modal>
  {#if game}
    {#await client.maybePlayer()}
      <Board {game} />
    {:then player}
      <Board {game} me={player} />
    {/await}
  {:else}
    <div class="container">
      <Title>Laden mislukt</Title>
      <p class="message">Het opgevraagde spel bestaat niet (meer).</p>
      <Button onclick={() => goto(resolve("/"))}>Terug naar start</Button>
    </div>
  {/if}
</Modal>

<style>
  .container {
    padding: 1rem 1.4rem;
    text-align: center;
  }

  .message {
    margin-block: 1rem;
    font-size: 1.2rem;
    font-weight: 600;
  }
</style>
