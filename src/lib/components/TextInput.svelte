<script lang="ts">
  let id = $props.id();
  type Props = {
    label: string;
    name?: string;
    type?: string;
    value?: string;
    required?: boolean;
    placeholder?: string;
  };
  let {
    label,
    name,
    type = "text",
    value = $bindable(),
    required,
    placeholder,
  }: Props = $props();
</script>

<div class="text-input">
  <label for={id}>{label}</label>
  <input {type} {id} {name} bind:value {required} {placeholder} />
</div>

<style>
  label {
    display: block;

    margin-bottom: 0.2rem;

    font-size: 1.25rem;
    font-weight: bold;
    line-height: 1;
  }

  input {
    display: block;

    box-sizing: border-box;
    min-width: 100%;
    padding: 0.4rem 0.8rem;
    border: 0.125rem solid var(--color-text);
    border-radius: 0.6rem;

    font-size: 1.25rem;
    font-weight: 600;

    background: #e3fff0;
    box-shadow: inset 0 0.125rem 0 0 #5f382250;

    &:focus {
      outline: 0.075rem solid rgb(from var(--color-text) r g b / 100%);
    }
  }
</style>
