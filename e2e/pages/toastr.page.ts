import { Page } from '@playwright/test';
import { OptionListComponent } from '@components/list/option-list.component';
import { CheckboxComponent } from '@components/checkbox/checkbox.component';
import { ButtonComponent } from '@components/button/button.component';
import { BaseComponent } from '@components/base.component';

export class ToastrPage extends BaseComponent {
    private readonly positionSelect: OptionListComponent;
    private readonly statusSelect: OptionListComponent;
    private readonly destroyByClickCheckbox: CheckboxComponent;
    private readonly preventDuplicatesCheckbox: CheckboxComponent;
    private readonly hasIconCheckbox: CheckboxComponent;
    private readonly showToastButton: ButtonComponent;
    private readonly randomToastButton: ButtonComponent;

    constructor(page: Page) {
        super(page, 'ToastrPage');
        this.positionSelect = new OptionListComponent(page, 'nb-select[[(selected)]="position"]');
        this.statusSelect = new OptionListComponent(page, 'nb-select[[(selected)]="status"]');
        this.destroyByClickCheckbox = new CheckboxComponent(page, 'nb-checkbox[[(ngModel)]="destroyByClick"]');
        this.preventDuplicatesCheckbox = new CheckboxComponent(page, 'nb-checkbox[[(ngModel)]="preventDuplicates"]');
        this.hasIconCheckbox = new CheckboxComponent(page, 'nb-checkbox[[(ngModel)]="hasIcon"]');
        this.showToastButton = new ButtonComponent(page, 'button:has-text("Show toast")');
        this.randomToastButton = new ButtonComponent(page, 'button:has-text("Random toast")');
    }

    async selectPosition(position: string) {
        await this.positionSelect.selectOption(position);
    }

    async selectStatus(status: string) {
        await this.statusSelect.selectOption(status);
    }

    async checkDestroyByClick() {
        await this.destroyByClickCheckbox.checkByLabel('Hide on click');
    }

    async uncheckDestroyByClick() {
        await this.destroyByClickCheckbox.uncheckByLabel('Hide on click');
    }

    async checkPreventDuplicates() {
        await this.preventDuplicatesCheckbox.checkByLabel('Prevent arising of duplicate toast');
    }

    async uncheckPreventDuplicates() {
        await this.preventDuplicatesCheckbox.uncheckByLabel('Prevent arising of duplicate toast');
    }

    async checkHasIcon() {
        await this.hasIconCheckbox.checkByLabel('Show toast with icon');
    }

    async uncheckHasIcon() {
        await this.hasIconCheckbox.uncheckByLabel('Show toast with icon');
    }

    async clickShowToastButton() {
        await this.showToastButton.clickButtonByText('Show toast');
    }

    async clickRandomToastButton() {
        await this.randomToastButton.clickButton('Random toast');
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
}