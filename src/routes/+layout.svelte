<script lang="ts">
  type Props = {
    children?: import("svelte").Snippet;
  };

  let { children }: Props = $props();
</script>

{@render children?.()}

<style>
  :global(html) {
    font-family: sans-serif;
    font-size: 10px;
    color: white;
    background-color: #032c2c;
  }

  :global(body) {
    font-size: 1.4rem;
  }

  :global(svelte-app) {
    display: contents;
  }
</style>
