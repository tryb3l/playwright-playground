import type {
  FullResult,
  Reporter,
  TestCase,
  TestResult,
} from '@playwright/test/reporter';

type ContractTestResult = {
  title: string;
  status: TestResult['status'];
  expectedStatus: TestCase['expectedStatus'];
  attachmentNames: string[];
  errorMessages: string[];
};

class ObservabilityContractReporter implements Reporter {
  private readonly tests: ContractTestResult[] = [];

  onTestEnd(test: TestCase, result: TestResult): void {
    this.tests.push({
      title: test.title,
      status: result.status,
      expectedStatus: test.expectedStatus,
      attachmentNames: result.attachments.map(({ name }) => name),
      errorMessages: result.errors.map(
        (error) => error.message ?? error.stack ?? 'Unknown error'
      ),
    });
  }

  onEnd(result: FullResult): void {
    process.stdout.write(
      JSON.stringify(
        {
          status: result.status,
          tests: this.tests,
        },
        null,
        2
      )
    );
  }
}

export default ObservabilityContractReporter;