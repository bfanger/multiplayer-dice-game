<script lang="ts">
</script>

<button on:click><slot /></button>

<style lang="scss">
  button {
    background: #eaeaea;
    color: #333;
    font: 2.1rem sans-serif;
    padding: 1.2rem 2.8rem;
    border-radius: 3rem;
    box-shadow: 0 0 0.5rem 0.5rem rgba(0, 0, 0, 0.2);
    letter-spacing: 0.5px;
    cursor: pointer;
    &:hover {
      background: #fff;
    }
  }
</style>
