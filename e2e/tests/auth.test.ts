import { createTestForStartPage, expect } from '@fixtures/custom-test';
import { StartPage } from '@fixtures/start-page.enum';

const loginTest = createTestForStartPage(StartPage.Login);
const registerTest = createTestForStartPage(StartPage.Register);
const requestPasswordTest = createTestForStartPage(StartPage.RequestPassword);
const resetPasswordTest = createTestForStartPage(StartPage.ResetPassword);

loginTest.use({
    authenticated: false,
    trackNetworkErrors: true,
});

registerTest.use({
    authenticated: false,
    trackNetworkErrors: true,
});

requestPasswordTest.use({
    authenticated: false,
    trackNetworkErrors: true,
});

resetPasswordTest.use({
    authenticated: false,
    trackNetworkErrors: true,
});

loginTest.describe('Auth Login Tests', () => {
    loginTest('Render migrated login page and submit demo login', async ({
        pageObject,
        page,
        user,
    }) => {
        // Arrange
        await expect(pageObject.getShell()).toBeVisible();
        await expect(pageObject.getPageSurface('login')).toBeVisible();
        await expect(pageObject.getTitle()).toHaveText('Login');
        await expect(pageObject.getRememberCheckbox()).toBeVisible();
        await expect(pageObject.getSocialLinks()).toHaveCount(3);

        // Act
        await pageObject.login(user.email, user.password);

        // Assert
        await expect(page).toHaveURL(/\/pages\/iot-dashboard$/);
    });
});

registerTest.describe('Auth Register Tests', () => {
    registerTest('Render migrated register page and submit demo registration', async ({
        pageObject,
        page,
        user,
    }) => {
        // Arrange
        await expect(pageObject.getShell()).toBeVisible();
        await expect(pageObject.getPageSurface('register')).toBeVisible();
        await expect(pageObject.getTitle()).toHaveText('Register');
        await expect(pageObject.getFullNameInput()).toBeVisible();
        await expect(pageObject.getConfirmPasswordInput()).toBeVisible();

        // Act
        await pageObject.register('Demo User', user.email, user.password);

        // Assert
        await expect(page).toHaveURL(/\/pages\/iot-dashboard$/);
    });
});

requestPasswordTest.describe('Auth Request Password Tests', () => {
    requestPasswordTest('Submit request password flow', async ({ pageObject, page }) => {
        // Arrange
        await expect(pageObject.getShell()).toBeVisible();
        await expect(pageObject.getPageSurface('request-password')).toBeVisible();
        await expect(pageObject.getTitle()).toHaveText('Request Password');
        await expect(pageObject.getEmailInput()).toBeVisible();
        await expect(pageObject.getPasswordInput()).toHaveCount(0);
        await expect(pageObject.getHelperLinks()).toHaveCount(1);

        // Act
        await pageObject.requestPassword('demo@example.com');

        // Assert
        await expect(page).toHaveURL(/\/pages\/iot-dashboard$/);
    });
});

resetPasswordTest.describe('Auth Reset Password Tests', () => {
    resetPasswordTest('Submit reset password flow', async ({ pageObject, page }) => {
        // Arrange
        await expect(pageObject.getShell()).toBeVisible();
        await expect(pageObject.getPageSurface('reset-password')).toBeVisible();
        await expect(pageObject.getTitle()).toHaveText('Reset Password');
        await expect(pageObject.getPasswordInput()).toBeVisible();
        await expect(pageObject.getConfirmPasswordInput()).toBeVisible();
        await expect(pageObject.getEmailInput()).toHaveCount(0);
        await expect(pageObject.getHelperLinks()).toHaveCount(2);

        // Act
        await pageObject.resetPassword('st0ngp@$$w0rD');

        // Assert
        await expect(page).toHaveURL(/\/pages\/iot-dashboard$/);
    });
});