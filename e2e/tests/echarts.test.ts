import { createTestForStartPage, expect, StartPage } from '@fixtures/custom-test';

const test = createTestForStartPage(StartPage.Echarts);

test.use({
    trackNetworkErrors: true,
    authenticated: false,
});

test.describe('Echarts Tests', () => {
    test('Render migrated chart cards', async ({ pageObject }) => {
        await expect(pageObject.getCards()).toHaveCount(7);
        await expect(pageObject.getCard('echart-card-pie')).toBeVisible();
        await expect(pageObject.getCard('echart-card-radar')).toBeVisible();
        await expect(pageObject.getRenderedCharts()).toHaveCount(7);
    });
});