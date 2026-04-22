import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { expect, test } from '@playwright/test';

type ContractTestResult = {
    title: string;
    status: string;
    expectedStatus: string;
    attachmentNames: string[];
    errorMessages: string[];
};

type ContractRunResult = {
    status: string;
    tests: ContractTestResult[];
};

function runObservabilityContract(): ContractRunResult {
    const cliPath = path.join(
        process.cwd(),
        'node_modules',
        '@playwright',
        'test',
        'cli.js'
    );
    const configPath = path.join(
        process.cwd(),
        'e2e',
        'contracts',
        'observability',
        'playwright.contract.config.ts'
    );

    const result = spawnSync(
        process.execPath,
        [cliPath, 'test', '--config', configPath],
        {
            cwd: process.cwd(),
            encoding: 'utf8',
            env: {
                ...process.env,
                CI: '1',
            },
        }
    );

    expect(result.error, result.error?.message).toBeUndefined();
    expect(result.status, result.stderr || 'Contract run did not exit cleanly').not.toBeNull();

    const stdout = result.stdout.trim();
    expect(stdout, result.stderr || 'Contract run did not produce reporter output').not.toBe('');

    try {
        return JSON.parse(stdout) as ContractRunResult;
    } catch (error) {
        throw new Error(
            `Failed to parse observability contract output.\nSTDOUT:\n${stdout}\nSTDERR:\n${result.stderr}\n${String(error)}`
        );
    }
}

function getTestResult(
    results: ContractRunResult,
    title: string
): ContractTestResult {
    const match = results.tests.find((testResult) => testResult.title === title);

    expect(match, `Missing contract result for "${title}"`).toBeDefined();
    return match!;
}

test('observability fixture keeps attachment-only and fail-policy semantics separate', async () => {
    // Arrange

    // Act
    const results = runObservabilityContract();

    // Assert
    expect(results.status).toBe('failed');
    expect(results.tests).toHaveLength(4);

    const softNoise = getTestResult(results, 'soft observability noise stays soft');
    expect(softNoise.status).toBe('passed');
    expect(softNoise.expectedStatus).toBe('passed');
    expect(softNoise.attachmentNames).toContain('Observability Errors');

    const hardConsole = getTestResult(
        results,
        'console policy can hard fail an otherwise passing test'
    );
    expect(hardConsole.status).toBe('failed');
    expect(hardConsole.expectedStatus).toBe('passed');
    expect(hardConsole.attachmentNames).toContain('Observability Errors');
    expect(hardConsole.errorMessages.join('\n')).toContain('Unexpected console errors');

    const hardNetwork = getTestResult(
        results,
        'network policy can hard fail an otherwise passing test'
    );
    expect(hardNetwork.status).toBe('failed');
    expect(hardNetwork.expectedStatus).toBe('passed');
    expect(hardNetwork.attachmentNames).toContain('Observability Errors');
    expect(hardNetwork.errorMessages.join('\n')).toContain('Unexpected network errors');

    const ordinaryFailure = getTestResult(
        results,
        'ordinary failures stay ordinary with observability noise'
    );
    expect(ordinaryFailure.status).toBe('failed');
    expect(ordinaryFailure.expectedStatus).toBe('passed');
    expect(ordinaryFailure.attachmentNames).toContain('Observability Errors');
    expect(ordinaryFailure.errorMessages.join('\n')).toContain(
        'primary assertion should remain the failure source'
    );
});