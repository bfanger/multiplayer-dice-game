<script lang="ts">
  import Hello from "$lib/Hello.svelte";

  let name = "world";

  function onClick() {
    name = "you";
  }
</script>

<Hello {name} on:click={onClick} />
<slot />
