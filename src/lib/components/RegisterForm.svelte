<script lang="ts">
  import api from "$lib/services/api";
  import auth from "$lib/services/auth.svelte";
  import Button from "./Button.svelte";
  import TextInput from "./TextInput.svelte";

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
  <TextInput label="Naam" name="name" required />
  <TextInput
    label="E-mailadres (optioneel)"
    name="email"
    type="email"
    placeholder="Voor gravatar"
  />
  <Button>Aanmelden</Button>
</form>

<style>
  .register {
    display: flex;
    flex-direction: column;
    gap: 1.2rem;
    width: clamp(10rem, 24rem, 100vw - 6rem);
  }
</style>
