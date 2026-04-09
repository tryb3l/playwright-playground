import { createTestForStartPage, expect } from '@fixtures/custom-test';
import { StartPage } from '@fixtures/start-page.enum';

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