<script lang="ts">
  export let name: string;
</script>

<h1 class="hello" on:click>Hello {name}</h1>

<style lang="scss">
  .hello {
    background-color: #14a354;
    color: white;
    padding: 40px;
    margin: 40px;
    font: bold 40px sans-serif;
    text-align: center;
    transition: letter-spacing 200ms;
    cursor: pointer;

    &:hover {
      letter-spacing: 1px;
    }
  }
</style>
