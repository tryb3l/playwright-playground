import { Locator, Page } from '@playwright/test';
import { OptionListComponent } from '@components/list/option-list.component';
import { BaseComponent } from '@components/base.component';

type ToastOptions = {
  position?: string;
  status?: string;
  title?: string;
  content?: string;
  duration?: number;
  destroyByClick?: boolean;
  preventDuplicates?: boolean;
  hasIcon?: boolean;
};

export class ToastrPage extends BaseComponent {
  private _positionSelect: OptionListComponent | undefined;
  private _statusSelect: OptionListComponent | undefined;

  constructor(page: Page) {
    super(page, 'ToastrPage');
  }

  private get positionSelect(): OptionListComponent {
    if (!this._positionSelect) {
      this._positionSelect = new OptionListComponent(
        this.page,
        'nb-select[[(selected)]="position"]'
      );
    }
    return this._positionSelect;
  }

  private get statusSelect(): OptionListComponent {
    if (!this._statusSelect) {
      this._statusSelect = new OptionListComponent(
        this.page,
        'nb-select[[(selected)]="status"]'
      );
    }
    return this._statusSelect;
  }

  async showToast(options?: ToastOptions) {
    if (options?.position !== undefined) {
      await this.selectPosition(options.position);
    }
    if (options?.status !== undefined) {
      await this.selectStatus(options.status);
    }
    if (options?.title !== undefined) {
      await this.setTitle(options.title);
    }
    if (options?.content !== undefined) {
      await this.setContent(options.content);
    }
    if (options?.duration !== undefined) {
      await this.setDuration(options.duration);
    }
    if (options?.destroyByClick !== undefined) {
      if (options.destroyByClick) {
        await this.checkDestroyByClick();
      } else {
        await this.uncheckDestroyByClick();
      }
    }
    if (options?.preventDuplicates !== undefined) {
      if (options.preventDuplicates) {
        await this.checkPreventDuplicates();
      } else {
        await this.uncheckPreventDuplicates();
      }
    }
    if (options?.hasIcon !== undefined) {
      if (options.hasIcon) {
        await this.checkHasIcon();
      } else {
        await this.uncheckHasIcon();
      }
    }

    await this.clickShowToastButton();
  }

  async selectPosition(position: string) {
    await this.positionSelect.selectOption(position);
  }

  async selectStatus(status: string) {
    await this.statusSelect.selectOption(status);
  }

  async checkDestroyByClick() {
    await this.check('Hide on click', { byLabel: 'Hide on click' });
  }

  async uncheckDestroyByClick() {
    await this.uncheck('Hide on click', { byLabel: 'Hide on click' });
  }

  async checkPreventDuplicates() {
    await this.check('Prevent arising of duplicate toast', {
      byLabel: 'Prevent arising of duplicate toast',
    });
  }

  async uncheckPreventDuplicates() {
    await this.uncheck('Prevent arising of duplicate toast', {
      byLabel: 'Prevent arising of duplicate toast',
    });
  }

  async checkHasIcon() {
    await this.check('Show toast with icon', {
      byLabel: 'Show toast with icon',
    });
  }

  async uncheckHasIcon() {
    await this.uncheck('Show toast with icon', {
      byLabel: 'Show toast with icon',
    });
  }

  async clickShowToastButton() {
    await this.click('Show toast', {
      byRole: 'button',
      name: 'Show toast',
      exact: true,
    });
  }

  async clickRandomToastButton() {
    await this.click('Random toast', {
      byRole: 'button',
      name: 'Random toast',
      exact: true,
    });
  }

  async setTitle(title: string) {
    await this.fill('input[name="title"]', title);
  }

  async setContent(content: string) {
    await this.fill('input[name="content"]', content);
  }

  async setDuration(duration: number) {
    await this.fill('input[name="timeout"]', duration.toString());
  }

  getToast(): Locator {
    return this.getByTestId('app-toast');
  }

  getToastTitle(): Locator {
    return this.getByTestId('app-toast-title');
  }

  getToastContent(): Locator {
    return this.getByTestId('app-toast-content');
  }
}
