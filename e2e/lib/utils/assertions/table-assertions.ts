import { BaseAssertions } from './base-assertions';

export class TableAssertions extends BaseAssertions {
  async assertRowCount(tableSelector: string, expectedCount: number) {
    const rows = this.context.locator(`${tableSelector} tr`);
    await expect(rows).toHaveCount(expectedCount);
  }

  async assertCellContent(cellSelector: string, expectedContent: string) {
    await this.expectToHaveText(cellSelector, expectedContent);
  }

  async assertSortedColumn(
    columnHeaderSelector: string,
    sortDirection: 'asc' | 'desc'
  ) {
    await this.expectToHaveClass(
      columnHeaderSelector,
      `sorted-${sortDirection}`
    );
  }
}
