<script lang="ts">
  import DiceDots from "../DiceDots.svelte";

  type Props = {
    value: number;
    disabled?: boolean;
    onclick?: () => void;
  };

  let { value, disabled = false, onclick }: Props = $props();
</script>

<button
  class="dice"
  class:even={value % 2 === 0}
  class:odd={value % 2 === 1}
  class:six={value === 6}
  class:inactive={!onclick}
  {disabled}
  {onclick}
>
  {#if value !== 6}
    <div class="dots">
      <DiceDots {value} />
    </div>
  {/if}
</button>

<style>
  .dice {
    cursor: pointer;
    user-select: none;

    position: relative;

    display: inline-block;

    width: 6em;
    height: 6em;
    padding: 0;
    border: 0.3rem outset #0178e9;
    border-radius: 1.2em;

    font-size: 0.75rem;
    color: #fffefd;

    appearance: none;
    background-color: #0178e9;

    &:disabled {
      cursor: not-allowed;
      opacity: 0.6;
    }

    &.inactive {
      pointer-events: none;
    }

    &:not(:disabled):hover {
      background-color: #0399f0;
    }

    &:not(:disabled):active {
      background-color: #084ecf;
    }

    &.six {
      &::after {
        content: "◎";

        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);

        font-size: 5.5em;
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
