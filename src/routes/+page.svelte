<script lang="ts">
  import { goto } from "$app/navigation";
  import client from "$lib/client.svelte";
  import Spinner from "$lib/components/Spinner.svelte";
  import api from "$lib/services/api";
  import Button from "$lib/components/Button.svelte";
  import RegisterForm from "$lib/components/RegisterForm.svelte";
  import { resolve } from "$app/paths";
  import { browser } from "$app/environment";
  import Modal from "$lib/components/Modal.svelte";

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
    <h1 class="title">Samen dobbelen</h1>
    {#await client.maybePlayer()}
      <Spinner />
    {:then player}
      {#if !browser}
        <Spinner />
      {:else if !player}
        <RegisterForm />
      {:else}
        <a
          href="https://gravatar.com"
          target="_blank"
          title="Upload jouw avatar naar Gravatar.com"
        >
          <img src={player.avatar} alt="Avatar" />
        </a>

        <h2>{player.name}</h2>
        <Button onclick={startNewGame}>Start een nieuw spel</Button>

        {#await api.get("games.json")}
          <Spinner />
        {:then games}
          <h1 class="title">Spellen</h1>
          <ul class="games">
            {#each games as game (game.id)}
              <li>
                <button class="join" onclick={() => joinGame(game.id)}>
                  Meedoen
                </button>
                {#if game.started === false}(nieuw){/if}
                {game.players.length} speler(s):

                {#each game.players as participant, index}
                  {participant.name}{#if index + 1 !== game.players.length},
                  {/if}
                {/each}
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
    min-height: 15rem;
  }

  .title {
    margin-bottom: 1rem;

    font: var(--heading-font);
    line-height: 1;
    text-transform: uppercase;
    letter-spacing: -0.04em;

    background: linear-gradient(
      to bottom,
      #f8fb38 0%,
      #ffde59 20%,
      #ff914d 100%
    );
    background-clip: text;
    filter: drop-shadow(0 0.3rem 0 var(--color-text))
      drop-shadow(-0.085rem -0.085rem 0 var(--color-text))
      drop-shadow(0.085rem -0.085rem 0 var(--color-text))
      drop-shadow(-0.085rem 0.085rem 0 var(--color-text))
      drop-shadow(0.085rem 0.085rem 0 var(--color-text));

    -webkit-text-fill-color: transparent;
  }

  .games {
    display: flex;
    flex-direction: column;
    align-items: center;

    margin: 0;
    padding: 0;

    list-style: none;
  }

  .join {
    float: right;
    margin-left: 1rem;
  }
</style>
