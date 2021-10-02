<script lang="ts" context="module">
  export type ShowToastFn = (message: string, ttl?: number) => void;
</script>

<script lang="ts">
  import { writable } from "svelte/store";
  import { slide } from "svelte/transition";

  type Toast = { message: string };

  const toasts = writable<Toast[]>([]);

  export const showToast: ShowToastFn = (message: string, ttl = 4) => {
    const toast: Toast = { message: message };
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
    padding: 1rem;
    width: clamp(20rem, max-content, 40rem);
    max-width: 80vw;
    background-color: #f4f7e6;
    color: black;
    font: bold 1.6rem sans-serif;
    border-radius: 1rem;
    box-shadow: 1px 1px 10px rgba(0, 0, 0, 0.5);
  }
</style>
