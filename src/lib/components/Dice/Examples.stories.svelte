<script module lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import Examples from "./Examples.svelte";

  const { Story } = defineMeta({
    title: "Component/Dice",
    component: Examples,
  });
</script>

<Story name="Examples" />
