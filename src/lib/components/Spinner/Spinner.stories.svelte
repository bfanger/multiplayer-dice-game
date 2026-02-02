<script module lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import Spinner from "./Spinner.svelte";

  const { Story } = defineMeta({
    title: "Component/Spinner",
    component: Spinner,
  });
</script>

<Story name="Default" />
