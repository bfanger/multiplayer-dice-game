<script lang="ts">
  import api from "$lib/services/api";
  import auth from "$lib/services/auth";
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  async function onRegister(e: SubmitEvent) {
    const form = new FormData(e.target as HTMLFormElement);
    const { token } = await api.post("signup.json", {
      name: form.get("name"),
      email: form.get("email"),
    });
    sessionStorage.setItem("dicegame_token", token);
    dispatch("signup");
  }

  async function onLogin() {
    await auth.login();
    location.reload();
  }
</script>

<form class="register" on:submit|preventDefault={onRegister}>
  <label for="name">Naam</label>
  <input id="name" name="name" type="text" required />
  <label for="email">E-mailadres</label>
  <input
    id="email"
    name="email"
    type="email"
    placeholder="Voor gravatar (optioneel)"
  />
  <input type="submit" value="Aanmelden" />
</form>
<button class="link" on:click={onLogin}>Ik ben Triple medewerker</button>

<style lang="scss">
  .register {
    display: grid;
    gap: 0.4rem;
  }
  label {
    text-align: right;
  }
  input {
    grid-column-start: 2;
    min-width: 20rem;
  }

  .link {
    background: transparent;
    border: 0;
    text-decoration: underline;
    color: #88cfff;
    margin-left: 8rem;
    margin-top: 2rem;
    cursor: pointer;
  }
</style>
