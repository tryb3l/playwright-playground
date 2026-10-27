import { spawn, spawnSync, type ChildProcess } from 'node:child_process';
import path from 'node:path';

const isWindows = process.platform === 'win32';
const appDirectory = path.resolve(process.cwd(), 'app');
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
const appServeCommand =
  'node ./node_modules/@angular/cli/bin/ng.js serve --host localhost --port 4200';
const defaultBaseUrl = process.env.BASE_URL || 'http://localhost:4200';
const appReadinessUrl = new URL('/', defaultBaseUrl).toString();
const appStartupTimeoutMs = Number(
  process.env.APP_STARTUP_TIMEOUT_MS || 180000
);
const appPollIntervalMs = 250;
const appShutdownGracePeriodMs = 5000;
const shouldReuseExistingServer =
  process.env.REUSE_EXISTING_SERVER !== 'false';

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

  throw new Error(`Timed out waiting ${timeoutMs}ms for ${appReadinessUrl}.`);
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
      reject(
        new Error(`Failed to start Angular app server: ${error.message}`)
      );
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

function isProcessGroupAlive(pid: number): boolean {
  try {
    process.kill(-pid, 0);
    return true;
  } catch {
    return false;
  }
}

function stopAppServerSync(child: ChildProcess): void {
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
      return;
    }

    process.kill(-pid, 'SIGTERM');
  } catch {
    // Process group already exited.
  }
}

async function stopAppServer(child: ChildProcess): Promise<void> {
  const { pid } = child;

  if (!pid) {
    return;
  }

  stopAppServerSync(child);

  if (isWindows) {
    return;
  }

  const deadline = Date.now() + appShutdownGracePeriodMs;
  while (Date.now() < deadline) {
    if (!isProcessGroupAlive(pid)) {
      return;
    }
    await delay(100);
  }

  try {
    process.kill(-pid, 'SIGKILL');
  } catch {
    // Process group already exited.
  }
}

function createWebServerConfig(isCI: boolean) {
  return {
    command: appServeCommand,
    cwd: './app',
    url: defaultBaseUrl,
    timeout: appStartupTimeoutMs,
    reuseExistingServer: !isCI && shouldReuseExistingServer,
    gracefulShutdown: {
      signal: 'SIGTERM' as const,
      timeout: appShutdownGracePeriodMs,
    },
  };
}

async function ensureAppServerReachable(): Promise<
  (() => Promise<void>) | undefined
> {
  if (await isAppReachable()) {
    return undefined;
  }

  const { child: appServer, startupFailure } = startAppServer();
  let stopped = false;

  const detachProcessListeners = () => {
    process.off('exit', handleExit);
    process.off('SIGINT', handleSignal);
    process.off('SIGTERM', handleSignal);
  };

  const handleExit = () => {
    if (stopped) {
      return;
    }
    stopped = true;
    detachProcessListeners();
    stopAppServerSync(appServer);
  };

  const cleanup = async () => {
    if (stopped) {
      return;
    }
    stopped = true;
    detachProcessListeners();
    await stopAppServer(appServer);
  };

  const handleSignal = (signal: NodeJS.Signals) => {
    handleExit();
    process.kill(process.pid, signal);
  };

  process.once('exit', handleExit);
  process.once('SIGINT', handleSignal);
  process.once('SIGTERM', handleSignal);

  try {
    await Promise.race([
      waitForAppToBeReachable(appStartupTimeoutMs),
      startupFailure,
    ]);
  } catch (error) {
    await cleanup();
    throw error;
  }

  return async () => {
    await cleanup();
  };
}

export {
  appStartupTimeoutMs,
  createWebServerConfig,
  defaultBaseUrl,
  ensureAppServerReachable,
};
