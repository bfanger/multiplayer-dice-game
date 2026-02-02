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
  <div class="value"><span class="font">{value}</span></div>
  <div class="points">{points}</div>
</button>

<style>
  .chip {
    cursor: pointer;

    display: inline-flex;
    flex-direction: column;
    align-items: center;

    width: 4em;
    height: 6em;
    border: #e2c184 outset 0.2em;
    border-radius: 0.6em;

    font-family: "Poetsen One", sans-serif;
    font-size: 0.75rem;

    appearance: none;
    background: #ebb450;

    &:disabled {
      cursor: not-allowed;
    }

    @media (width <= 600px) {
      font-size: 0.5rem;
    }

    @media (width <= 480px) {
      font-size: 0.4rem;
    }

    @media (width <= 420px) {
      font-size: 0.3rem;
    }
  }

  .value {
    display: flex;
    align-items: center;
    justify-content: center;

    width: 3.4em;
    height: 50%;
    border-bottom: 1px solid #333;

    color: #1c1f3b;

    .font {
      font-size: 1.8em;
    }

    .flipped & {
      display: none;
    }
  }

  .points {
    display: flex;
    align-items: center;
    justify-content: center;

    height: 50%;

    font-size: 2.2em;
    color: #a03e10;

    .flipped & {
      display: none;
    }
  }
</style>
