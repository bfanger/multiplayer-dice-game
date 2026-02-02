<script lang="ts">
  import type { PlayerAvatar } from "$lib/game-logic/types";

  import chickUrl from "../../../assets/avatars/chick.png";
  import roosterUrl from "../../../assets/avatars/rooster.png";
  import nestUrl from "../../../assets/avatars/nest.png";
  import chickenUrl from "../../../assets/avatars/chicken.png";

  const avatars = [chickUrl, roosterUrl, nestUrl, chickenUrl];

  type Props = {
    avatar: PlayerAvatar;
    active?: boolean;
  };

  let { avatar, active }: Props = $props();
</script>

<div class="avatar" class:active class:inactive={active === false}>
  <img
    class="image"
    src={avatars[avatar.index % avatars.length]}
    style:background-color={avatar.color}
    alt="Player avatar"
  />
</div>

<style>
  .avatar {
    overflow: hidden;
    display: inline-flex;
    align-items: center;
    justify-content: center;

    box-sizing: content-box;
    width: 4.2em;
    height: 4.2em;
    padding: 0.2em;
    border: 0.125rem solid #0d7880;
    border-radius: 1.3em;

    font-size: var(--font-size, inherit);

    background: #fff;

    &.inactive {
      border-width: 1px;
    }

    &.active {
      border-color: var(--color-text);
      border-width: 1px;
      outline: 2px solid var(--color-text);
    }
  }

  .image {
    display: inline-block;

    width: 100%;
    height: 100%;
    border-radius: 0.9em;

    object-fit: contain;
  }
</style>
