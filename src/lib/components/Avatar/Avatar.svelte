<script lang="ts">
  import type { PlayerAvatar } from "$lib/game-logic/types";

  import chickUrl from "../../../assets/avatars/chick.png";
  import roosterUrl from "../../../assets/avatars/rooster.png";
  import nestUrl from "../../../assets/avatars/nest.png";
  import chickenUrl from "../../../assets/avatars/chicken.png";

  const avatars = [chickUrl, roosterUrl, nestUrl, chickenUrl];

  type Props = {
    avatar: PlayerAvatar;
  };

  let { avatar }: Props = $props();
</script>

<div class="avatar">
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

    width: 4.2rem;
    height: 4.2rem;
    border: 0.125rem solid #0d7880;
    border-radius: 1.3rem;

    background: #fff;
  }

  .image {
    display: inline-block;

    width: calc(100% - 0.6rem);
    height: calc(100% - 0.6rem);
    border-radius: 0.9rem;

    object-fit: contain;
  }
</style>
