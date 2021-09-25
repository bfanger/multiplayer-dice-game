/* eslint-disable no-param-reassign */
import { PublicClientApplication } from "@azure/msal-browser";

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

let authPromise: Promise<string>;
const scopes: string[] = [];
if (typeof window !== "undefined") {
  const account = getClient().getAllAccounts()[0];
  if (account) {
    authPromise = getClient()
      .acquireTokenSilent({ scopes, account })
      .then((result) => result.accessToken);
  }
}

const auth = {
  async accessToken(): Promise<string> {
    if (authPromise) {
      return authPromise;
    }
    return Promise.reject(new Error("Not logged in"));
  },
  async login(): Promise<string> {
    authPromise = getClient()
      .loginPopup({ scopes })
      .then((result) => result.accessToken);
    return authPromise;
  },
};
export default auth;
