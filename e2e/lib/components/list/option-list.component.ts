import { Locator, Page } from "@playwright/test";
import { BaseComponent } from '@components/base.component';

export class OptionListComponent extends BaseComponent {
    protected optionListLocator: Locator;

    constructor(page: Page, optionListSelector: string) {
        super(page);
        this.optionListLocator = page.locator(optionListSelector);
        this.context = this.optionListLocator;
    }

    async filterOption(optionText: string): Promise<Locator> {
        return this.optionListLocator.locator('nb-option').filter({ hasText: optionText });
    }

    async selectOption(optionText: string){
        const option = await this.filterOption(optionText);
        if (!await option.count()) { // Or we can use option.isVisible() if its expected to be present but hidden
          throw new Error(`Option with text "${optionText}" not found in OptionListComponent.`);
        }
        await this.click(option);
    }
}