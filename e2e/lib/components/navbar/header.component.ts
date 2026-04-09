import { Locator, Page } from '@playwright/test';
import { BaseComponent } from '@components/base.component';

type ThemeName = 'default' | 'dark' | 'cosmic' | 'corporate';

export class HeaderComponent extends BaseComponent {
  constructor(page: Page) {
    super(page);
  }

  getThemeSelect(): Locator {
    return this.getByTestId('theme-select');
  }

  getThemeOption(themeName: ThemeName): Locator {
    return this.getByTestId(`theme-option-${themeName}`);
  }

  getSelectedThemeValue(): Locator {
    return this.page.locator('.theme-field .mat-mdc-select-value-text');
  }

  async selectTheme(themeName: ThemeName): Promise<void> {
    const themeSelect = this.getThemeSelect();
    await themeSelect.waitFor({ state: 'visible' });
    await themeSelect.click();
    await this.getThemeOption(themeName).click();
  }
}