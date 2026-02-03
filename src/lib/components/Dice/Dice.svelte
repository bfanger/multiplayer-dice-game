<script lang="ts">
  import DiceDots from "../DiceDots.svelte";

  type Props = {
    value: number;
    available?: boolean;
    invalid?: boolean;
    hovered?: boolean;
    interactive?: boolean;
    onclick?: () => void;
    onmouseenter?: () => void;
    onmouseleave?: () => void;
  };

  let {
    value,
    available = false,
    invalid = false,
    hovered = false,
    interactive = false,
    onclick,
    onmouseenter,
    onmouseleave,
  }: Props = $props();
</script>

<button
  class="dice"
  class:even={value % 2 === 0}
  class:odd={value % 2 === 1}
  class:six={value === 6}
  class:interactive
  class:invalid
  class:hovered
  class:available
  {onclick}
  {onmouseenter}
  {onmouseleave}
>
  {#if value !== 6}
    <div class="dots">
      <DiceDots {value} />
    </div>
  {/if}
</button>

<style>
  .dice {
    user-select: none;

    position: relative;

    display: inline-block;

    width: 6em;
    height: 6em;
    padding: 0;
    border: 0.3rem outset #0178e9;
    border-radius: 1.2em;

    font-size: var(--font-size, 0.75rem);
    color: #fffefd;

    appearance: none;
    background-color: #0178e9;

    transition: transform 0.1s;

    &.invalid {
      filter: hue-rotate(150deg);
    }

    &.interactive.available {
      cursor: pointer;
    }

    &.interactive:not(.available) {
      cursor: not-allowed;
      opacity: 0.9;

      @media (pointer: coarse) {
        opacity: 0.4;
      }
    }

    &.available.hovered {
      transform: scale(1.04);
      filter: brightness(1.1);
    }

    &.available.hovered:active {
      filter: brightness(0.9);
    }

    &.six {
      &::after {
        content: "◎";

        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);

        font-size: 5.2em;
        color: #1d2a83;
      }
    }
  }

  .dots {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    width: 85%;
    height: 85%;
  }
</style>
