<script lang="ts">
  type Props = {
    value: number;
  };

  let { value }: Props = $props();

  let dots = $derived(Array(value).fill(null));
</script>

<div class="dice-dots" class:even={value % 2 === 0} class:odd={value % 2 === 1}>
  {#each dots as _}
    <span class="dot">.</span>
  {/each}
</div>

<style>
  .dice-dots {
    position: relative;

    aspect-ratio: 1 / 1;
    width: 100%;
    min-width: 1.8em;
    height: auto;
  }

  .dot {
    position: absolute;
    transform: translate(-50%, -50%);

    width: 1em;
    height: 1em;
    border-radius: 0.5em;

    line-height: 0;

    background: currentcolor;

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
