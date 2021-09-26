<script lang="ts">
  export let value: number;
  export let points: number;
  export let flipped = false;
  export let disabled = false;
</script>

<button class="chip" class:flipped {disabled} on:click>
  <div class="value">{value}</div>
  <div class="points">{points}</div>
</button>

<style lang="scss">
  .chip {
    appearance: none;
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    background: #ebb450;
    width: 4rem;
    height: 6rem;
    border-radius: 0.6rem;
    border: #e2c184 outset 0.2rem;
    cursor: pointer;
    &:disabled {
      cursor: not-allowed;
    }
  }
  .value {
    width: 3.4rem;
    height: 50%;
    border-bottom: 1px solid #333;
    font: bold 1.8rem sans-serif;
    color: #1c1f3b;
    display: flex;
    align-items: center;
    justify-content: center;
    .flipped & {
      display: none;
    }
  }
  .points {
    font: 900 2rem sans-serif;
    height: 50%;
    color: #a03e10;
    display: flex;
    align-items: center;
    justify-content: center;
    .flipped & {
      display: none;
    }
  }
</style>
