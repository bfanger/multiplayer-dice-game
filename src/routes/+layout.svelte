<script lang="ts">
  type Props = {
    children?: import("svelte").Snippet;
  };

  let { children }: Props = $props();
</script>

{@render children?.()}

<style>
  @font-face {
    font-family: Dosis;
    font-weight: 200 800;
    font-style: normal;

    font-display: block;
    src: url("../assets/fonts/Dosis-VariableFont_wght.woff2")
      format("woff2-variations");
  }

  @font-face {
    font-family: "Poetsen One";
    font-weight: 400;
    font-style: normal;

    src: url("../assets/fonts/PoetsenOne-Regular.woff2") format("woff2");
  }

  :root {
    --color-background: #95e4ff;
    --color-text: #5f3822;
    --heading-font: 3rem "Poetsen One", sans-serif;

    color: var(--color-text);
    background: var(--color-background);
  }

  :global(*) {
    margin: 0;
    font-family: inherit;
    font-size: inherit;
  }

  :global(html) {
    font-family: Dosis, sans-serif;
  }

  :global(body) {
    font-size: 1rem;
  }

  :global(svelte-app) {
    display: contents;
  }
</style>
