<script lang="ts">
  import { goto } from "$app/navigation";
  import client from "$lib/client.svelte";
  import Spinner from "$lib/components/Spinner/Spinner.svelte";
  import api from "$lib/services/api";
  import Button from "$lib/components/Button.svelte";
  import RegisterForm from "$lib/components/RegisterForm.svelte";
  import { resolve } from "$app/paths";
  import { browser } from "$app/environment";
  import Modal from "$lib/components/Modal.svelte";
  import Avatar from "$lib/components/Avatar/Avatar.svelte";
  import Title from "$lib/components/Title.svelte";

  async function startNewGame() {
    const id = await client.createGame(); // @todo report error
    await goto(resolve("/games/[id]", { id }));
  }

  async function joinGame(id: string) {
    await client.joinGame(id);
    await goto(resolve("/games/[id]", { id }));
  }
</script>

<svelte:head>
  <title>Samen dobbelen</title>
</svelte:head>

<Modal>
  <div class="container">
    <Title>Samen dobbelen</Title>
    {#await client.maybePlayer()}
      <Spinner />
    {:then player}
      {#if !browser}
        <Spinner />
      {:else if !player}
        <RegisterForm />
      {:else}
        <div class="player-info">
          <Avatar avatar={player.avatar} />
          <h2>{player.name}</h2>
        </div>

        {#await api.get("games.json")}
          <Spinner />
        {:then games}
          <ul class="games">
            <li>
              <Button onclick={startNewGame}>Start een nieuw spel</Button>
            </li>
            {#each games as game (game.id)}
              <li class="join">
                <div>
                  {#if game.started === false}(nieuw){/if}
                  {game.players.length} speler(s):

                  {#each game.players as participant, index}
                    {participant.name}{#if index + 1 !== game.players.length},
                    {/if}
                  {/each}
                </div>
                <Button onclick={() => joinGame(game.id)}>Meedoen</Button>
              </li>
            {:else}
              <p>Geen spellen actief</p>
            {/each}
          </ul>
        {/await}
      {/if}
    {/await}
  </div>
</Modal>

<style>
  .container {
    display: flex;
    flex-direction: column;
    align-items: center;

    min-height: 10rem;
    padding: 1rem 1.4rem;
  }

  .player-info {
    display: flex;
    gap: 1rem;
    align-items: center;

    margin-top: 1.4rem;

    font-size: 2rem;
  }

  .games {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
    align-items: center;

    margin: 0;
    margin-top: 1rem;
    padding: 0;

    list-style: none;
  }

  .join {
    display: flex;
    gap: 1rem;
    align-items: center;
  }
</style>
