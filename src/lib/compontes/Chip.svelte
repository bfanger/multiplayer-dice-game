<script lang="ts">
  export let value: number;
  export let points: number;
  export let flipped: boolean;
</script>

<div class="chip" class:flipped>
  <div class="value">{value}</div>
  <div class="points">{points}</div>
</div>

<style lang="scss">
  .chip {
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    background: #ebb450;
    width: 4rem;
    height: 6rem;
    border-radius: 0.6rem;
    border: #e2c184 outset 0.2rem;
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
  }
  .points {
    font: 900 2rem sans-serif;
    height: 50%;
    color: #a03e10;
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
