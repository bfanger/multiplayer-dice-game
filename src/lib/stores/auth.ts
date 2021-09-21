/* eslint-disable no-param-reassign */
import { PublicClientApplication } from "@azure/msal-browser";
import type { AuthenticationResult, AccountInfo } from "@azure/msal-browser";
import { derived, writable } from "svelte/store";

let c: PublicClientApplication | undefined;
function getClient() {
  if (!c)
    c = new PublicClientApplication({
      auth: {
        clientId: "2edb3d23-0340-4c39-9eea-84820ecd9120",
        redirectUri: `${window.location.protocol}//${window.location.host}/login`,
      },
      cache: { cacheLocation: "localStorage" },
    });
  return c;
}

export const ready = writable(false);
export const accessToken = writable("");
export const account = writable<AccountInfo | null>(null);

const store = derived(
  [ready, accessToken, account],
  ([$ready, $accessToken, $account]) => ({
    ready: $ready,
    accessToken: $accessToken,
    account: $account,
  })
);
function onAuth(result: AuthenticationResult) {
  accessToken.set(result.accessToken);
  account.set(result.account);
}
const scopes: string[] = [];
if (typeof window !== "undefined") {
  const $account = getClient().getAllAccounts()[0];
  if (!$account) {
    ready.set(true);
  } else {
    getClient()
      .acquireTokenSilent({ scopes, account: $account })
      .then(onAuth)
      .finally(() => ready.set(true));
  }
}

const auth = {
  ...store,
  async login(): Promise<void> {
    await getClient().loginPopup({ scopes }).then(onAuth);
  },
};
export default auth;
