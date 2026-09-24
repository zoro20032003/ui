import { PocketIc } from "@dfinity/pic";
import type { Actor } from "@dfinity/pic";
import { afterAll, beforeAll, expect, it } from "vitest";

import { idlFactory } from "../../src/frontend/src/declarations/backend.did.js";
import type { _SERVICE } from "../../src/frontend/src/declarations/backend.did";

/**
 * Backend behavior lane for the صديقك showcase build.
 *
 * The deliverable is a static HTML artifact, but the app's backend is a real
 * composition root (authorization mixin + OQL `Expose`) and it must answer its
 * own public API instead of trapping. This lane installs the compiled wasm into
 * the platform's PocketIC replica and calls the real canister, so a backend
 * whose public methods are unimplemented stubs cannot pass.
 */

const PIC_URL = process.env.POCKET_IC_URL ?? "";
const BACKEND_WASM = process.env.BACKEND_WASM ?? "";

let pic: PocketIc | undefined;
let actor: Actor<_SERVICE>;

beforeAll(async () => {
  pic = await PocketIc.create(PIC_URL);
  ({ actor } = await pic.setupCanister<_SERVICE>({
    idlFactory,
    wasm: BACKEND_WASM,
  }));
});

afterAll(async () => {
  await pic?.tearDown();
});

it("answers the schema read instead of trapping", async () => {
  const schema = await actor.schema();
  expect(typeof schema).toBe("string");
  expect(schema.length).toBeGreaterThan(0);
});

it("reports the caller role and admin flag for a fresh caller", async () => {
  const role = await actor.getCallerUserRole();
  expect(role).toHaveProperty("guest");
  await expect(actor.isCallerAdmin()).resolves.toBe(false);
});

it("initializes access control idempotently", async () => {
  await expect(actor._initialize_access_control()).resolves.toBeNull();
  await expect(actor._initialize_access_control()).resolves.toBeNull();
});

it("starts an internet-identity sign-in flow", async () => {
  const nonce = await actor._internet_identity_sign_in_start();
  expect(nonce).toBeInstanceOf(Uint8Array);
  expect(nonce.length).toBeGreaterThan(0);
});
