import { spawn, spawnSync, type ChildProcess } from 'node:child_process';
import path from 'node:path';

const isWindows = process.platform === 'win32';
const appDirectory = path.resolve(__dirname, 'app');
const angularCliEntrypoint = path.join(
    appDirectory,
    'node_modules',
    '@angular',
    'cli',
    'bin',
    'ng.js'
);
const appServeArgs = [
    angularCliEntrypoint,
    'serve',
    '--host',
    'localhost',
    '--port',
    '4200',
];
const defaultBaseUrl = process.env.BASE_URL || 'http://localhost:4200';
const appReadinessUrl = new URL('/', defaultBaseUrl).toString();
const appStartupTimeoutMs = Number(process.env.APP_STARTUP_TIMEOUT_MS || 180000);
const appPollIntervalMs = 250;

function delay(timeoutMs: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, timeoutMs));
}

async function isAppReachable(): Promise<boolean> {
    try {
        const response = await fetch(appReadinessUrl, {
            method: 'GET',
            redirect: 'manual',
        });

        return response.status < 500;
    } catch {
        return false;
    }
}

async function waitForAppToBeReachable(timeoutMs: number): Promise<void> {
    const deadline = Date.now() + timeoutMs;

    while (Date.now() < deadline) {
        if (await isAppReachable()) {
            return;
        }

        await delay(appPollIntervalMs);
    }

    throw new Error(
        `Timed out waiting ${timeoutMs}ms for ${appReadinessUrl}.`
    );
}

function startAppServer(): {
    child: ChildProcess;
    startupFailure: Promise<never>;
} {
    const child = spawn(process.execPath, appServeArgs, {
        cwd: appDirectory,
        stdio: ['ignore', 'ignore', 'pipe'],
        detached: !isWindows,
    });

    let stderr = '';

    child.stderr?.setEncoding('utf8');
    child.stderr?.on('data', (chunk: string) => {
        stderr = `${stderr}${chunk}`.slice(-4000);
    });

    const startupFailure = new Promise<never>((_, reject) => {
        child.once('error', (error) => {
            reject(new Error(`Failed to start Angular app server: ${error.message}`));
        });

        child.once('exit', (code, signal) => {
            reject(
                new Error(
                    `Angular app server exited before becoming reachable (code: ${code ?? 'null'}, signal: ${signal ?? 'null'}).${stderr ? `\n\n${stderr.trim()}` : ''}`
                )
            );
        });
    });

    if (!isWindows) {
        child.unref();
    }

    return { child, startupFailure };
}

function stopAppServer(child: ChildProcess): void {
    const { pid } = child;

    if (!pid) {
        return;
    }

    try {
        if (isWindows) {
            const result = spawnSync('taskkill', ['/pid', String(pid), '/T', '/F'], {
                stdio: 'ignore',
            });

            if (result.error) {
                child.kill();
            }
        } else {
            process.kill(-pid, 'SIGTERM');
        }
    } catch {
        // Best-effort cleanup only.
    }
}

export default async function globalSetup() {
    if (await isAppReachable()) {
        return undefined;
    }

    const { child: appServer, startupFailure } = startAppServer();

    try {
        await Promise.race([
            waitForAppToBeReachable(appStartupTimeoutMs),
            startupFailure,
        ]);
    } catch (error) {
        stopAppServer(appServer);
        throw error;
    }

    return async () => {
        stopAppServer(appServer);
    };
}