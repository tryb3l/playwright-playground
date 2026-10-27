import { expect, type Page, type TestInfo } from '@playwright/test';
import { ConsoleErrorsTracker } from '@utils/console-errors-tracker';
import { NetworkErrorsTracker } from '@utils/network-errors-tracker';

const defaultNetworkIgnorePatterns = [
  '/assets/',
  '.png',
  '.jpg',
  '.jpeg',
  '.gif',
  '.svg',
  '.css',
  '.js',
  '.woff',
  '.woff2',
  '.map',
  'favicon.ico',
  'p.scdn.co',
] as const;

type NetworkTrackingConfig = {
  trackNetworkErrors?: boolean;
  ignoreNetworkErrors?: readonly string[];
  strictNetwork?: boolean;
  statusCodesToIgnore?: readonly number[];
};

type ObservabilityPolicy = {
  failOnConsoleErrors?: boolean;
  failOnNetworkErrors?: boolean;
};

function createConsoleErrorsTracker(
  page: Page,
  ignoreConsoleErrors?: string[]
): ConsoleErrorsTracker {
  const tracker = new ConsoleErrorsTracker(page, ignoreConsoleErrors, {
    maxErrors: 50,
  });
  tracker.startTracking();
  return tracker;
}

function createNetworkErrorsTracker(
  page: Page,
  config: NetworkTrackingConfig
): NetworkErrorsTracker {
  const trackNetworkErrors = config.trackNetworkErrors ?? true;
  const customIgnorePatterns = config.ignoreNetworkErrors ?? [];
  const effectiveIgnorePatterns = config.strictNetwork
    ? customIgnorePatterns
    : [...defaultNetworkIgnorePatterns, ...customIgnorePatterns];

  const tracker = new NetworkErrorsTracker(page, {
    maxErrors: 50,
    ignorePatterns: effectiveIgnorePatterns,
    statusCodesToIgnore: config.statusCodesToIgnore,
    trackResponses: trackNetworkErrors,
    trackRequestFailures: trackNetworkErrors,
  });

  if (trackNetworkErrors) {
    tracker.startTracking();
  }

  return tracker;
}

function buildObservabilityReport(
  consoleTracker: ConsoleErrorsTracker,
  networkTracker: NetworkErrorsTracker
): string {
  const consoleErrors = consoleTracker.getErrors();
  const networkErrors = networkTracker.getErrors();

  if (consoleErrors.length === 0 && networkErrors.length === 0) {
    return '';
  }

  const sections: string[] = [
    `Summary: console=${consoleErrors.length}, network=${networkErrors.length}`,
  ];

  if (consoleErrors.length > 0) {
    sections.push(
      '=== Console Errors ===\n' + consoleTracker.getErrorsAsText()
    );
  }

  if (networkErrors.length > 0) {
    sections.push(
      '=== Network Errors ===\n' + networkTracker.getErrorsAsText()
    );
  }

  return sections.join('\n\n');
}

async function attachObservabilityReport(
  testInfo: TestInfo,
  consoleTracker: ConsoleErrorsTracker,
  networkTracker: NetworkErrorsTracker
): Promise<void> {
  const report = buildObservabilityReport(consoleTracker, networkTracker);
  if (!report) return;

  await testInfo.attach('Observability Errors', {
    body: report,
    contentType: 'text/plain',
  });
}

async function finalizeObservability(
  testInfo: TestInfo,
  consoleTracker: ConsoleErrorsTracker,
  networkTracker: NetworkErrorsTracker,
  policy: ObservabilityPolicy
): Promise<void> {
  consoleTracker.stopTracking();
  networkTracker.stopTracking();

  await attachObservabilityReport(testInfo, consoleTracker, networkTracker);

  if (testInfo.status !== testInfo.expectedStatus) {
    return;
  }

  if (policy.failOnConsoleErrors) {
    const consoleErrors = consoleTracker.getErrors();
    expect(
      consoleErrors,
      consoleErrors.length
        ? `Unexpected console errors:\n${consoleTracker.getErrorsAsText()}`
        : undefined
    ).toHaveLength(0);
  }

  if (policy.failOnNetworkErrors) {
    const networkErrors = networkTracker.getErrors();
    expect(
      networkErrors,
      networkErrors.length
        ? `Unexpected network errors:\n${networkTracker.getErrorsAsText()}`
        : undefined
    ).toHaveLength(0);
  }
}

export {
  attachObservabilityReport,
  buildObservabilityReport,
  createConsoleErrorsTracker,
  createNetworkErrorsTracker,
  finalizeObservability,
};
