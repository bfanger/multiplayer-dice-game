<script lang="ts">
  import api from "$lib/services/api";

  type Props = {
    signup: () => void;
  };
  let { signup }: Props = $props();

  async function onRegister(e: SubmitEvent) {
    e.preventDefault();

    const form = new FormData(e.target as HTMLFormElement);
    const { token } = await api.post("signup.json", {
      name: form.get("name"),
      email: form.get("email"),
    });
    sessionStorage.setItem("dicegame_token", token);
    signup();
  }
</script>

<form class="register" onsubmit={onRegister}>
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

<style>
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
</style>
