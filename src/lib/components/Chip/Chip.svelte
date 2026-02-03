<script lang="ts">
  import DiceDots from "../DiceDots.svelte";

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
  <div class="points"><DiceDots value={points} /></div>
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

    appearance: none;
    background: linear-gradient(170deg, #ffd847 20%, #ffb732 90%);

    &:disabled {
      cursor: not-allowed;
      opacity: 0.8;
      filter: grayscale(80%);
    }
  }

  .value {
    display: flex;
    align-items: center;
    justify-content: center;

    width: 3.4em;
    height: 50%;
    border-bottom: 1px solid #d29b25;

    color: #4d1d06;

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

    box-sizing: border-box;
    width: 70%;
    height: 50%;
    padding: 0.4em;

    font-size: 0.7em;
    color: #a03e10;

    .flipped & {
      display: none;
    }
  }
</style>
