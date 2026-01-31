<script lang="ts" module>
  export type ShowToastFn = (message: string, ttl?: number) => void;
</script>

<script lang="ts">
  import { writable } from "svelte/store";
  import { slide } from "svelte/transition";

  type Toast = { message: string };

  const toasts = writable<Toast[]>([]);

  export const showToast: ShowToastFn = (message: string, ttl = 4) => {
    const toast: Toast = { message };
    $toasts = [...$toasts, toast];
    setTimeout(() => {
      $toasts = $toasts.filter((entry) => entry !== toast);
    }, ttl * 1000);
  };
</script>

{#each $toasts as toast (toast)}
  <div class="toast" transition:slide|local={{ duration: 300 }}>
    {toast.message}
  </div>
{/each}

<style>
  .toast {
    width: clamp(20rem, max-content, 40rem);
    max-width: 80vw;
    padding: 1rem;
    border-radius: 1rem;

    font: bold 1.6rem sans-serif;
    color: black;

    background-color: #f4f7e6;
    box-shadow: 1px 1px 10px rgb(0 0 0 / 50%);
  }
</style>
