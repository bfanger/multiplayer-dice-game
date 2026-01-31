<script lang="ts">
  import type { Snippet } from "svelte";

  type Props = {
    children: Snippet;
    onclick: () => void;
  };

  let { children, onclick }: Props = $props();
</script>

<button {onclick}>{@render children()}</button>

<style>
  button {
    cursor: pointer;

    padding: 1.2rem 2.8rem;
    border-radius: 3rem;

    font: 2.1rem sans-serif;
    color: #333;
    letter-spacing: 0.5px;

    background: #eaeaea;
    box-shadow: 0 0 0.5rem 0.5rem rgb(0 0 0 / 20%);

    &:hover {
      background: #fff;
    }
  }
</style>
