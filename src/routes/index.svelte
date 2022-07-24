<script lang="ts" context="module">
  import type { Load } from "@sveltejs/kit";

  export const load: Load = async ({ fetch }) => {
    const player =
      typeof window === "undefined"
        ? undefined
        : await client.me(fetch).catch(() => undefined);
    return { props: { player } };
  };
</script>

<script lang="ts">
  import { goto } from "$app/navigation";
  import client from "$lib/client";
  import Spinner from "$lib/components/Spinner.svelte";
  import auth from "$lib/services/auth";
  import type { Player } from "$lib/game-logic/types";
  import api from "$lib/services/api";
  import Button from "$lib/components/Button.svelte";

  export let player: Player | undefined;

  async function onCreate() {
    const id = await client.createGame(); // @todo report error
    goto(`/games/${id}`);
  }
  async function onLogin() {
    await auth.login();
    player = await client.me();
  }
  async function onJoin(id: string) {
    await client.joinGame(id);
    goto(`/games/${id}`);
  }
</script>

<svelte:head>
  <title>Samen dobbelen</title>
</svelte:head>

<div class="container">
  {#if player}
    <a
      href="https://gravatar.com"
      target="_blank"
      title="Upload your avatar to Gravatar.com"
    >
      <img src={player.avatar} alt="Avatar" />
    </a>
    <h2>{player.name}</h2>
    <Button on:click={onCreate}>Start een nieuw spel</Button>
    {#await api.get("games.json")}
      <Spinner />
    {:then games}
      <h1>Spellen</h1>
      <ul class="games">
        {#each games as game (game.id)}
          <li>
            <button class="join" on:click={() => onJoin(game.id)}
              >Meedoen</button
            >
            {#if game.started === false}(nieuw){/if}
            {game.players.length} speler(s):

            {#each game.players as player, index}
              {player.name}{#if index + 1 !== game.players.length}, {/if}
            {/each}
          </li>
        {:else}
          <p>Geen spellen actief</p>
        {/each}
      </ul>
    {/await}
  {:else if typeof window === "undefined"}
    <Spinner />
  {:else}
    <Button on:click={onLogin}>Login</Button>
  {/if}
</div>

<style>
  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 2rem;
  }
  .games {
    display: flex;
    flex-direction: column;
    align-items: center;
    list-style: none;
    padding: 0;
    margin: 0;
  }
  .join {
    float: right;
    margin-left: 1rem;
  }
</style>
