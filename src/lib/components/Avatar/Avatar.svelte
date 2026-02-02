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

<div class="avatar" class:active class:default={active === undefined}>
  <img
    class="image"
    src={avatars[avatar.index % avatars.length]}
    style:background-color={avatar.color}
    alt="Player avatar"
  />
</div>

<style>
  .avatar {
    display: inline-flex;
    align-items: center;
    justify-content: center;

    width: 4.2em;
    height: 4.2em;
    border: 0.125rem solid #0d7880aa;
    border-radius: 1.3em;

    font-size: var(--font-size, inherit);

    background: #fff;

    &.default {
      border-color: #0d7880;
    }

    &.active {
      border-color: var(--color-text);
    }
  }

  .image {
    display: inline-block;

    width: calc(100% - 0.6em);
    height: calc(100% - 0.6em);
    border-radius: 0.9em;

    object-fit: contain;
  }
</style>
