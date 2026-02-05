<script lang="ts">
  import type { Snippet } from "svelte";

  type Props = {
    children: Snippet;
    onclick?: () => void;
  };

  let { children, onclick }: Props = $props();
</script>

<button {onclick}>
  <div class="label">
    {@render children()}
  </div>
</button>

<style>
  button {
    cursor: pointer;

    padding: 0.4rem 0.8rem;
    border: 0.2rem solid #398a03;
    border-radius: 0.8rem;

    background: linear-gradient(to bottom, #6cf40e 0%, #58d70b 100%);
    box-shadow: inset 0 0.2rem 0 0 #b4ff62;

    &:hover {
      filter: brightness(1.05);
    }

    &:active {
      filter: brightness(1);
      box-shadow: inset 0 0.1rem 0 0 #b4ff62;
    }
  }

  .label {
    user-select: none;
    font:
      1.2rem "Poetsen One",
      sans-serif;
    color: #fff;
    text-shadow:
      -0.1rem -0.1rem 0 #000,
      0.1rem -0.1rem 0 #000,
      -0.1rem 0.1rem 0 #000,
      0.1rem 0.1rem 0 #000;

    :active & {
      transform: translate(0, 0.5px);
    }
  }
</style>
