<script lang="ts">
  type Props = {
    value: number;
    disabled?: boolean;
    onclick?: () => void;
  };

  let { value, disabled = false, onclick }: Props = $props();

  let dots = $derived(Array(value).fill(null));
</script>

<button
  class="dice"
  class:even={value % 2 === 0}
  class:odd={value % 2 === 1}
  class:six={value === 6}
  {disabled}
  {onclick}
>
  {#each dots as _}
    <span class="dot"></span>
  {/each}
</button>

<style>
  .dice {
    cursor: pointer;

    position: relative;

    display: inline-block;

    width: 6rem;
    height: 6rem;
    padding: 0;
    border: 0.3rem outset #ffd;
    border-radius: 1.2rem;

    appearance: none;
    background-color: #eeeeb1;

    &:disabled {
      cursor: not-allowed;
      opacity: 0.7;
    }

    &:active {
      background-color: #ffff7b;
    }

    &:not(:disabled):hover {
      background-color: #ffffb3;
    }

    &.six {
      &::after {
        content: "◎";

        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);

        font-size: 5rem;
        color: red;
      }

      .dot {
        display: none;
      }
    }
  }
  /* stylelint-disable no-descending-specificity */
  .dot {
    position: absolute;
    transform: translate(-50%, -50%);

    width: 0.8rem;
    height: 0.8rem;
    border-radius: 0.4rem;

    background: #333;

    .odd & {
      &:nth-child(1) {
        top: 50%;
        left: 50%;
      }

      &:nth-child(2) {
        top: 20%;
        left: 20%;
      }

      &:nth-child(3) {
        top: 80%;
        left: 80%;
      }

      &:nth-child(4) {
        top: 80%;
        left: 20%;
      }

      &:nth-child(5) {
        top: 20%;
        left: 80%;
      }
    }

    .even & {
      &:nth-child(1) {
        top: 20%;
        left: 20%;
      }

      &:nth-child(2) {
        top: 80%;
        left: 80%;
      }

      &:nth-child(3) {
        top: 20%;
        left: 80%;
      }

      &:nth-child(4) {
        top: 80%;
        left: 20%;
      }

      &:nth-child(5) {
        top: 50%;
        left: 20%;
      }

      &:nth-child(6) {
        top: 50%;
        left: 80%;
      }
    }
  }
</style>
