# Playwright E2E Test Suite

End-to-end test architecture and domain language for exercising the Angular application through user-observable behavior.

## Language

**StartPage**:
A named application screen that a test opens as its starting point by navigating from the application root through the sidebar menu.
_Avoid_: Route, target page, page key, section path

**PageObject**:
A module representing a single application screen's user-facing operations and observable state, instantiated automatically for the test's chosen `StartPage`.
_Avoid_: Page service, page wrapper, screen controller, locator map

**AppServer**:
The local Angular application process under test, managed across startup, readiness probing, and process-group teardown so no orphaned processes survive a test run.
_Avoid_: Webserver helper, dev server wrapper, server runner

**Observability**:
Automatic capture, filtering, report attachment, and pass/fail evaluation of browser console/page errors and network failures during a test run.
_Avoid_: Error logger, noise tracker, diagnostic listener
