<script lang="ts">
  import type { Snippet } from "svelte";

  type Props = {
    children: Snippet;
  };
  let { children }: Props = $props();
</script>

<h1 class="title">{@render children()}</h1>

<style>
  .title {
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
</style>
