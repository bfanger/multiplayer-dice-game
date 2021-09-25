<script lang="ts">
  export let name: string;
  export let avatar: string;
  export let active = false;
  export let disabled = false;
</script>

<div class="player" class:active class:disabled>
  <img class="avatar" src={avatar} alt="" />
  <span>{name}</span>
</div>

<style lang="scss">
  .player {
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    font-size: 1.3rem;
    background-color: rgb(12, 87, 12);
    padding: 1rem;
    border-radius: 2rem;
    &.active {
      background-color: white;
      color: black;
    }
    &.disabled {
      opacity: 0.5;
    }
  }
  .avatar {
    border-radius: 50%;
    width: 8rem;
    height: 8rem;
    object-fit: cover;
    margin-bottom: 1rem;
  }
</style>
