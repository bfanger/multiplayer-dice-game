<script lang="ts">
  import "../app.css";

  type Props = {
    children?: import("svelte").Snippet;
  };

  let { children }: Props = $props();
</script>

{@render children?.()}
