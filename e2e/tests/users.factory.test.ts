import { promises as fs } from 'fs';
import { test, expect } from '@playwright/test';
import { Users } from '@factories/users';

const userEnvKeys = [
  'USE_DEFAULT_USER',
  'USE_USER_FROM_FILE',
  'USER_CREDENTIALS_FILE',
] as const;

const originalEnv = Object.fromEntries(
  userEnvKeys.map((key) => [key, process.env[key]])
);

function restoreUserEnv(): void {
  for (const key of userEnvKeys) {
    const originalValue = originalEnv[key];

    if (originalValue === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = originalValue;
    }
  }
}

test.afterEach(() => {
  restoreUserEnv();
});

test.describe('Users Factory', () => {
  test('load credentials from an explicit JSON file', async ({ }, testInfo) => {
    // Arrange
    const credentialsFilePath = testInfo.outputPath('user-credentials.json');
    const expectedCredentials = {
      email: 'reader@example.com',
      password: 'ReaderPassword123!',
    };

    await fs.writeFile(
      credentialsFilePath,
      JSON.stringify(expectedCredentials, null, 2)
    );

    process.env.USE_USER_FROM_FILE = 'true';
    process.env.USER_CREDENTIALS_FILE = credentialsFilePath;

    // Act
    const users = new Users();
    const actualCredentials = await users.getUserCredentials();

    // Assert
    expect(actualCredentials).toEqual(expectedCredentials);
  });

  test('reject storage-state shaped JSON when credentials are expected', async ({ }, testInfo) => {
    // Arrange
    const storageStateFilePath = testInfo.outputPath('storage-state.json');

    await fs.writeFile(
      storageStateFilePath,
      JSON.stringify({
        cookies: [],
        origins: [],
      })
    );

    process.env.USE_USER_FROM_FILE = 'true';
    process.env.USER_CREDENTIALS_FILE = storageStateFilePath;

    // Act
    const users = new Users();

    // Assert
    await expect(users.getUserCredentials()).rejects.toThrow(
      /must contain string "email" and "password" fields/
    );
  });
});