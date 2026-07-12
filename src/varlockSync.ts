#!/usr/bin/env node

import { execSync } from "node:child_process";
import "varlock/auto-load";
execSync("npx svelte-kit sync", { env: process.env, stdio: "inherit" });
