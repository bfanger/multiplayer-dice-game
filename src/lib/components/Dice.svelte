<script lang="ts">
  export let value: number;
  export let disabled = false;

  $: dots = Array(value).fill(null);
</script>

<button
  class="dice"
  class:even={value % 2 === 0}
  class:odd={value % 2 === 1}
  class:six={value === 6}
  {disabled}
  on:click
>
  {#each dots as _}
    <span class="dot" />
  {/each}
</button>

<style lang="scss">
  .dice {
    appearance: none;
    display: inline-block;
    width: 6rem;
    height: 6rem;
    background-color: #eeeeb1;
    border: 0.3rem outset #ffd;
    border-radius: 1.2rem;
    position: relative;
    padding: 0;
    cursor: pointer;
    &:disabled {
      cursor: not-allowed;
      opacity: 0.7;
    }
    &:not(:disabled):hover {
      background-color: #ffffb3;
    }
    &:active {
      background-color: #ffff7b;
    }
    &.six {
      .dot {
        display: none;
      }
      &:after {
        content: "◎";
        color: red;
        font-size: 5rem;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
    }
  }
  .dot {
    background: #333;
    position: absolute;
    width: 0.8rem;
    height: 0.8rem;
    border-radius: 0.4rem;
    transform: translate(-50%, -50%);

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
