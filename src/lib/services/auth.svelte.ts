import { browser } from "$app/environment";

const auth = new (class {
  accessToken = $state(
    browser
      ? (sessionStorage.getItem("dicegame_token") ?? undefined)
      : undefined,
  );

  assertLoggedIn(): void {
    if (!this.accessToken) {
      throw new Error("Not logged in");
    }
  }
  setAccessToken(token: string): void {
    sessionStorage.setItem("dicegame_token", token);
  }
})();
export default auth;
