<script lang="ts">
</script>

<div class="spinner" title="Bezig met laden...">
  <div class="dot"></div>
  <div class="dot"></div>
  <div class="dot"></div>
</div>

<style>
  .dot {
    width: var(--dot-size, 0.8rem);
    height: var(--dot-size, 0.8rem);
    border-radius: 50%;

    background: var(--dot-color, currentcolor);

    animation: pulse 0.8s infinite ease-in-out;

    &:nth-child(1) {
      animation-delay: -0.2s;
    }

    &:nth-child(2) {
      animation-delay: -0.1s;
    }
  }

  .spinner {
    display: inline-flex;
    gap: 0.4rem;
    align-items: center;
    justify-content: center;
  }

  @keyframes pulse {
    0%,
    80%,
    100% {
      transform: scale(0.8);
      opacity: 0.3;
    }

    40% {
      transform: scale(1);
      opacity: 1;
    }
  }
</style>
