# End-to-End Testing Project Specification & Requirements

## Problem Statement

Browser E2E suites for single-page applications break down when:

1. **Navigation and selectors leak into specs**: When tests call `page.goto()` manually, pass raw CSS or `data-testid` strings into assertion wrappers, or split one screen across five files, a single UI change requires edits across many modules.
2. **Failures lack runtime context**: A failure screenshot rarely shows whether a test broke because of a UI regression, an uncaught `console.error`, a failed HTTP request, or an orphaned local dev server holding port `4200`.

## Solution

A Playwright E2E suite for the Angular 21 dashboard built around five module boundaries:

- **`StartPage` Fixture Registry**: `createTestForStartPage(StartPage)` opens `/`, clicks through the sidebar menu to the target `StartPage`, and injects its typed `PageObject`.
- **`PageObject` & Composite Widgets**: Screen-level `PageObject` modules own selectors, actions, and state readers. Reusable component modules exist only for multi-step widgets (datepickers, custom select overlays, navigation bars, form cards).
- **`Observability` Policy & Reporting**: Automatic capture of `console.error`, uncaught `pageerror`, failed requests, and HTTP `>= 400` responses. Captured noise is attached to test results and evaluated against per-test failure rules without masking primary assertion failures.
- **`AppServer` Lifecycle**: Centralized server startup, readiness polling, and process-group teardown (`SIGTERM` with a 5-second grace period before `SIGKILL`).
- **Base Fixtures & Auth Bootstrap**: Shared fixture options for authenticated browser contexts (with optional storage-state reuse), credential loading, and `Observability` flags.

## User Stories

1. As a test author, I want to declare a test's `StartPage` with `createTestForStartPage(StartPage)`, so that navigation and `PageObject` instantiation run automatically before each test.
2. As a test author, I want `StartPage` navigation to click through the sidebar menu from `/`, so that feature specs continuously verify the application shell and menu links.
3. As a test author, I want `createTestForStartPage` to infer the exact TypeScript type of `pageObject` for the chosen `StartPage`, so that I get autocomplete without manual type casts.
4. As a test author, I want to register a new screen by adding one `StartPage` key and `PageObject` class to the fixture registry, so that I only touch one module per screen.
5. As a test author, I want `PageObject` modules to expose semantic locators and typed state snapshots, so that test specs never contain raw CSS or `data-testid` strings.
6. As a test author, I want multi-step widgets (Material calendars, Nebular option lists, sidebar navigation, theme switcher, and form cards) encapsulated in composite component modules, so that widget logic is reused across `PageObject` modules.
7. As a test author, I want single HTML primitives (buttons, checkboxes, radio inputs, text inputs) handled directly by the base component methods, so that the component tree has no pass-through wrappers.
8. As a test author, I want to opt into an authenticated session with `test.use({ authenticated: true })`, so that tests requiring a logged-in user bootstrap authentication state before opening their `StartPage`.
9. As a test author, I want `REUSE_AUTH=true` to reuse `playwright/.auth/user.json` when present, so that local authenticated runs skip repeating UI login.
10. As a test author, I want credentials generated per run by default, fixed when `USE_DEFAULT_USER=true`, or loaded from JSON when `USE_USER_FROM_FILE=true` and `USER_CREDENTIALS_FILE` are set, so that I can test with either ephemeral or pre-seeded accounts.
11. As a test author, I want credential loading to reject invalid JSON or Playwright storage-state files with an explicit error, so that misconfigured credential paths fail immediately.
12. As a test engineer, I want `console.error`, uncaught `pageerror`, failed requests, and HTTP `>= 400` responses captured automatically during every test, so that runtime errors are recorded alongside UI steps.
13. As a test engineer, I want captured console and network errors attached to the Playwright result as an `Observability Errors` text report whenever any occur, so that I can read them in the HTML report.
14. As a test author, I want `failOnConsoleErrors` enabled by default and configurable per test, so that unexpected console errors fail passing tests unless explicitly ignored.
15. As a test author, I want `failOnNetworkErrors`, `ignoreNetworkErrors`, `statusCodesToIgnore`, and `strictNetwork` configurable per test, so that I can fail on unexpected network errors while ignoring known static-asset noise.
16. As a test engineer, I want `Observability` policy checks skipped when a test has already failed (`testInfo.status !== testInfo.expectedStatus`), so that the primary assertion failure stays the reported error while the `Observability Errors` report is still attached.
17. As a developer, I want `AppServer` to start the Angular app automatically when port `4200` is not reachable, so that `npm run test:e2e` runs in one command.
18. As a developer, I want `REUSE_EXISTING_SERVER=true` to reuse a running local Angular server outside CI, so that local test runs start immediately.
19. As a developer or CI operator, I want `AppServer` teardown to kill the entire server process group (`SIGTERM` then `SIGKILL` after 5 seconds) on normal exit, startup failure, `SIGINT`, or `SIGTERM`, so that no orphaned `ng serve` processes survive a run.
20. As a CI operator, I want `playwright.config.ts` to load `.env.dev` by default (overridable via `ENV_FILE` and `BASE_URL`) and apply strict CI settings (`forbidOnly: true`, 2 retries, 1 worker, 30-minute global timeout), so that local and CI runs share one configuration surface.
21. As a CI operator, I want GitHub Actions to run the suite across Chromium and Firefox on Node 26 and retain `playwright-report/` for 30 days, so that cross-browser failures are diagnosable on every pull request.

## Implementation Decisions

- **Unified `StartPage` & Fixture Registry**:
  - `StartPage`, the `StartPage`-to-`PageObject` registry, sidebar navigation, and `createTestForStartPage` live in one module (`custom-test.ts`).
  - `createTestForStartPage` extends `base-fixtures.ts` with only `startPageReady` and `pageObject`, inheriting `page`, `user`, `authContext`, and `Observability` fixtures directly.
- **Sidebar-Driven `StartPage` Navigation**:
  - Opening a `StartPage` loads `/` and clicks through the collapsible sidebar menu items (`aria-expanded` check + click) instead of jumping directly to a route URL.
- **`PageObject` Verification Surface**:
  - Each `PageObject` owns its selectors and exposes semantic `Locator` getters or typed state-reader methods. Separate assertion-factory wrappers are not used, and sub-element locators used only internally stay `private`.
- **Composite Widget Boundary**:
  - Component classes in `e2e/lib/components/` wrap composite, multi-step UI widgets. Single HTML elements (`button`, `checkbox`, `radio`, `input`) use `BaseComponent` methods (`click`, `fill`, `check`, `uncheck`).
- **Self-Contained `Observability` Module**:
  - Default network ignore patterns, tracker creation (`ConsoleErrorsTracker` and `NetworkErrorsTracker`), bounded storage (`maxErrors: 50`), $O(1)$ status-code lookup (`ReadonlySet<number>`), report formatting, attachment, and failure evaluation (`finalizeObservability`) live in `observability-report.ts`.
- **Unified `AppServer` Module**:
  - Base URL, startup timeout, Angular CLI entrypoint, Playwright `webServer` config (`gracefulShutdown`), readiness polling, and process-group teardown (`-pid` signaling with `SIGKILL` fallback) live in `app-server.ts`, shared by `config-utils.ts` and `global-setup.ts`.

## Testing Decisions

- **Test Surface**:
  - Specs test user-observable behavior across the highest seam (`createTestForStartPage` + `PageObject`), never internal implementation details or raw selectors.
- **Primary Testing Seams**:
  1. **Feature E2E Seam (`createTestForStartPage` + `PageObject`)**: All 12 screen specs drive the app through `pageObject` and assert with Playwright's `expect()`.
  2. **`Observability` Contract Seam**: `observability-contract.test.ts` runs a dedicated Playwright contract config and inspects the structured reporter output to verify soft attachments, hard console/network failures, and non-masking of primary assertion errors.
  3. **Credential & Auth Bootstrap Seam**: `users.factory.test.ts` and `authenticated-fixture.test.ts` test credential resolution modes, invalid-file rejection, and storage-state bootstrap.
- **Pre-Test Checks**:
  - `npm run test:e2e` frees port `4200`, runs `tsc --noEmit`, and executes the Playwright suite.

## Out of Scope

- Standalone backend API testing (the Angular app uses client-side in-memory data services).
- Pixel-diff visual regression testing.
- Load or synthetic performance benchmarking.
- Automated security vulnerability scanning.

## Further Notes

- Domain terms (`StartPage`, `PageObject`, `AppServer`, `Observability`) are defined in [`GLOSSARY.md`](../../GLOSSARY.md).


