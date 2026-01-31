<script lang="ts">
  type Props = {
    value: number;
    points: number;
    flipped?: boolean;
    disabled?: boolean;
    onclick?: () => void;
  };

  let {
    value,
    points,
    flipped = false,
    disabled = false,
    onclick,
  }: Props = $props();
</script>

<button class="chip" class:flipped {disabled} {onclick}>
  <div class="value">{value}</div>
  <div class="points">{points}</div>
</button>

<style>
  .chip {
    cursor: pointer;

    display: inline-flex;
    flex-direction: column;
    align-items: center;

    width: 4rem;
    height: 6rem;
    border: #e2c184 outset 0.2rem;
    border-radius: 0.6rem;

    appearance: none;
    background: #ebb450;

    &:disabled {
      cursor: not-allowed;
    }
  }

  .value {
    display: flex;
    align-items: center;
    justify-content: center;

    width: 3.4rem;
    height: 50%;
    border-bottom: 1px solid #333;

    font: bold 1.8rem sans-serif;
    color: #1c1f3b;

    .flipped & {
      display: none;
    }
  }

  .points {
    display: flex;
    align-items: center;
    justify-content: center;

    height: 50%;

    font: 900 2rem sans-serif;
    color: #a03e10;

    .flipped & {
      display: none;
    }
  }
</style>
