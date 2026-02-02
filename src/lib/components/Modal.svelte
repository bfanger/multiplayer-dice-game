<script lang="ts">
  import type { Snippet } from "svelte";

  type Props = {
    children: Snippet;
  };
  let { children }: Props = $props();
</script>

<div class="modal">
  <div class="window">
    <div class="body">
      {@render children()}
    </div>
  </div>
</div>

<style>
  .modal {
    position: fixed;
    top: 0;
    left: 0;

    overflow-y: scroll;
    display: grid;
    grid-template-rows: 1fr auto 2fr;
    justify-content: center;

    width: 100%;
    height: 100%;
  }

  .window {
    grid-row: 2 / 3;

    width: min-content;
    padding: 0.5rem;
    border: 0.2rem solid #0d7880;
    border-radius: 2.2rem;

    background: linear-gradient(to top, #239ca4 0%, #41aead 100%);
    box-shadow: inset 0 0.2rem 0 0 #8de5db;
  }

  .body {
    width: max-content;
    max-width: calc(100vw - 6rem);
    border: 0.2rem solid #0d7880;
    border-radius: 1.6rem;

    background: #c7ffdf;
  }
</style>
