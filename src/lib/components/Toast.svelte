<script lang="ts">
  import { SvelteMap } from "svelte/reactivity";
  import { slide } from "svelte/transition";
  export type ShowToastFn = (message: string, ttl?: number) => void;

  type Toast = { message: string };
  type Props = {
    showToast: ShowToastFn;
  };
  let { showToast = $bindable() }: Props = $props();
  const toasts = new SvelteMap<Toast, Toast>();

  showToast = (message: string, ttl = 4) => {
    const toast: Toast = { message };
    toasts.set(toast, toast);
    setTimeout(() => {
      toasts.delete(toast);
    }, ttl * 1000);
  };
</script>

{#each toasts.values() as toast (toast)}
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
