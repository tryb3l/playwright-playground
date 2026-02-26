import type { TestInfo } from '@playwright/test';
import type { ConsoleErrorsTracker } from '@utils/console-errors-tracker';
import type { NetworkErrorsTracker } from '@utils/network-errors-tracker';

function buildObservabilityReport(
  consoleTracker: ConsoleErrorsTracker,
  networkTracker: NetworkErrorsTracker
): string {
  const consoleErrors = consoleTracker.getErrors();
  const networkErrors = networkTracker.getErrors();

  const sections: string[] = [];

  if (consoleErrors.length > 0 || networkErrors.length > 0) {
    sections.push(
      `Summary: console=${consoleErrors.length}, network=${networkErrors.length}`
    );
  }

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
  if (!report.trim()) return;

  await testInfo.attach('Observability Errors', {
    body: report,
    contentType: 'text/plain',
  });

  testInfo.fail(true, 'Observability errors detected');
}

export { buildObservabilityReport, attachObservabilityReport };
