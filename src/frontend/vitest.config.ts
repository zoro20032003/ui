import { defineConfig } from "vitest/config";

/**
 * Test-runner configuration for the frontend suite.
 *
 * The showcase deliverable is a static HTML artifact, so the suite parses it
 * with jsdom. The pool is pinned to a single fork because the sandbox supplies
 * conflicting thread bounds to Vitest's default pool, which otherwise aborts
 * the run before any test file loads.
 */
export default defineConfig({
  test: {
    environment: "jsdom",
    pool: "forks",
    poolOptions: {
      forks: {
        singleFork: true,
        minForks: 1,
        maxForks: 1,
      },
    },
  },
});
