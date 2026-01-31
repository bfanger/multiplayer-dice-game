<script lang="ts">
  import api from "$lib/services/api";
  import auth from "$lib/services/auth.svelte";

  type Props = {
    onregistered?: () => void;
  };
  let { onregistered }: Props = $props();

  async function signUp(e: SubmitEvent) {
    e.preventDefault();
    const form = new FormData(e.target as HTMLFormElement);
    const { token } = await api.post("signup.json", {
      name: form.get("name"),
      email: form.get("email"),
    });
    auth.setAccessToken(token);
    onregistered?.();
  }
</script>

<form class="register" onsubmit={signUp}>
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
