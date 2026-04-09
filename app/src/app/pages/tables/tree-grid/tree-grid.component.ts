import { Component } from '@angular/core';

interface TreeNode<T> {
  data: T;
  children?: TreeNode<T>[];
}

interface FSEntry {
  name: string;
  size: string;
  kind: string;
  items?: number;
}

interface FlatTreeRow extends FSEntry {
  level: number;
  expandable: boolean;
  expanded: boolean;
  path: string;
}

type SortColumn = keyof FSEntry;
type SortDirection = 'asc' | 'desc' | '';

@Component({
  selector: 'ngx-tree-grid',
  templateUrl: './tree-grid.component.html',
  styleUrls: ['./tree-grid.component.scss'],
  standalone: false,
})
export class TreeGridComponent {
  readonly customColumn: SortColumn = 'name';
  readonly defaultColumns: SortColumn[] = ['size', 'kind', 'items'];
  allColumns = [this.customColumn, ...this.defaultColumns];

  rows: FlatTreeRow[] = [];
  filterQuery = '';

  sortColumn: SortColumn = 'name';
  sortDirection: SortDirection = '';

  private readonly expandedPaths = new Set<string>();

  constructor() {
    this.rebuildRows();
  }

  onFilterChange(query: string): void {
    this.filterQuery = query.trim().toLowerCase();
    this.rebuildRows();
  }

  toggleSort(column: SortColumn): void {
    if (this.sortColumn !== column) {
      this.sortColumn = column;
      this.sortDirection = 'asc';
      this.rebuildRows();
      return;
    }

    if (this.sortDirection === 'asc') {
      this.sortDirection = 'desc';
    } else if (this.sortDirection === 'desc') {
      this.sortDirection = '';
    } else {
      this.sortDirection = 'asc';
    }

    this.rebuildRows();
  }

  toggleRow(path: string): void {
    if (this.expandedPaths.has(path)) {
      this.expandedPaths.delete(path);
    } else {
      this.expandedPaths.add(path);
    }

    this.rebuildRows();
  }

  getSortIcon(column: SortColumn): string {
    if (this.sortColumn !== column || this.sortDirection === '') {
      return 'fa-sort';
    }

    return this.sortDirection === 'asc' ? 'fa-sort-up' : 'fa-sort-down';
  }

  trackByPath(index: number, row: FlatTreeRow): string {
    return row.path;
  }

  private data: TreeNode<FSEntry>[] = [
    {
      data: { name: 'Projects', size: '1.8 MB', items: 5, kind: 'dir' },
      children: [
        { data: { name: 'project-1.doc', kind: 'doc', size: '240 KB' } },
        { data: { name: 'project-2.doc', kind: 'doc', size: '290 KB' } },
        { data: { name: 'project-3', kind: 'txt', size: '466 KB' } },
        { data: { name: 'project-4.docx', kind: 'docx', size: '900 KB' } },
      ],
    },
    {
      data: { name: 'Reports', kind: 'dir', size: '400 KB', items: 2 },
      children: [
        { data: { name: 'Report 1', kind: 'doc', size: '100 KB' } },
        { data: { name: 'Report 2', kind: 'doc', size: '300 KB' } },
      ],
    },
    {
      data: { name: 'Other', kind: 'dir', size: '109 MB', items: 2 },
      children: [
        { data: { name: 'backup.bkp', kind: 'bkp', size: '107 MB' } },
        { data: { name: 'secret-note.txt', kind: 'txt', size: '2 MB' } },
      ],
    },
  ];

  private rebuildRows(): void {
    const filteredData = this.filterTree(this.data, this.filterQuery);
    const sortedData = this.sortTree(filteredData);
    this.rows = this.flattenRows(sortedData);
  }

  private filterTree(nodes: TreeNode<FSEntry>[], query: string): TreeNode<FSEntry>[] {
    return nodes.flatMap((node) => {
      const children = node.children ? this.filterTree(node.children, query) : undefined;

      if (!query) {
        return [{
          data: { ...node.data },
          children,
        }];
      }

      const matchesSelf = Object.values(node.data)
        .some((value) => String(value ?? '').toLowerCase().includes(query));

      if (!matchesSelf && (!children || children.length === 0)) {
        return [];
      }

      return [{
        data: { ...node.data },
        children,
      }];
    });
  }

  private sortTree(nodes: TreeNode<FSEntry>[]): TreeNode<FSEntry>[] {
    const preparedNodes = nodes.map((node) => ({
      data: { ...node.data },
      children: node.children ? this.sortTree(node.children) : undefined,
    }));

    if (this.sortDirection === '') {
      return preparedNodes;
    }

    const directionMultiplier = this.sortDirection === 'asc' ? 1 : -1;
    return preparedNodes.sort((left, right) => directionMultiplier * this.compareEntries(left.data, right.data));
  }

  private flattenRows(
    nodes: TreeNode<FSEntry>[],
    level: number = 0,
    parentPath: string = 'root',
  ): FlatTreeRow[] {
    return nodes.flatMap((node, index) => {
      const path = `${parentPath}/${node.data.name}-${index}`;
      const children = node.children ?? [];
      const expanded = this.filterQuery.length > 0 || this.expandedPaths.has(path);
      const row: FlatTreeRow = {
        ...node.data,
        level,
        expandable: children.length > 0,
        expanded,
        path,
      };

      const visibleChildren = row.expandable && expanded
        ? this.flattenRows(children, level + 1, path)
        : [];

      return [row, ...visibleChildren];
    });
  }

  private compareEntries(left: FSEntry, right: FSEntry): number {
    const leftValue = this.normalizeSortValue(left[this.sortColumn], this.sortColumn);
    const rightValue = this.normalizeSortValue(right[this.sortColumn], this.sortColumn);

    if (leftValue < rightValue) {
      return -1;
    }

    if (leftValue > rightValue) {
      return 1;
    }

    return 0;
  }

  private normalizeSortValue(value: string | number | undefined, column: SortColumn): number | string {
    if (column === 'size') {
      return this.parseSize(String(value ?? '0 B'));
    }

    if (column === 'items') {
      return Number(value ?? -1);
    }

    return String(value ?? '').toLowerCase();
  }

  private parseSize(size: string): number {
    const match = size.trim().match(/^(\d+(?:\.\d+)?)\s*(B|KB|MB|GB)$/i);
    if (!match) {
      return 0;
    }

    const units: Record<string, number> = {
      B: 1,
      KB: 1024,
      MB: 1024 * 1024,
      GB: 1024 * 1024 * 1024,
    };

    return parseFloat(match[1]) * units[match[2].toUpperCase()];
  }
}
