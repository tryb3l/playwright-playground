import { Page } from '@playwright/test';
import { OptionListComponent } from '@components/list/option-list.component';
import { CheckboxComponent } from '@components/checkbox/checkbox.component';
import { ButtonComponent } from '@components/button/button.component';
import { BaseComponent } from '@components/base.component';

export class ToastrPage extends BaseComponent {
    private _positionSelect: OptionListComponent | undefined;
    private _statusSelect: OptionListComponent | undefined;
    private _destroyByClickCheckbox: CheckboxComponent | undefined;
    private _preventDuplicatesCheckbox: CheckboxComponent | undefined;
    private _hasIconCheckbox: CheckboxComponent | undefined;
    private _showToastButton: ButtonComponent | undefined;
    private _randomToastButton: ButtonComponent | undefined;

    constructor(page: Page) {
        super(page, 'ToastrPage');
    }

    private get positionSelect(): OptionListComponent {
        if (!this._positionSelect) {
            this._positionSelect = new OptionListComponent(this.page, 'nb-select[[(selected)]="position"]');
        }
        return this._positionSelect;
    }

    private get statusSelect(): OptionListComponent {
        if (!this._statusSelect) {
            this._statusSelect = new OptionListComponent(this.page, 'nb-select[[(selected)]="status"]');
        }
        return this._statusSelect;
    }

    private get destroyByClickCheckbox(): CheckboxComponent {
        if (!this._destroyByClickCheckbox) {
            this._destroyByClickCheckbox = new CheckboxComponent(this.page, 'nb-checkbox[[(ngModel)]="destroyByClick"]');
        }
        return this._destroyByClickCheckbox;
    }

    private get preventDuplicatesCheckbox(): CheckboxComponent {
        if (!this._preventDuplicatesCheckbox) {
            this._preventDuplicatesCheckbox = new CheckboxComponent(this.page, 'nb-checkbox[[(ngModel)]="preventDuplicates"]');
        }
        return this._preventDuplicatesCheckbox;
    }

    private get hasIconCheckbox(): CheckboxComponent {
        if (!this._hasIconCheckbox) {
            this._hasIconCheckbox = new CheckboxComponent(this.page, 'nb-checkbox[[(ngModel)]="hasIcon"]');
        }
        return this._hasIconCheckbox;
    }
    private get showToastButton(): ButtonComponent {
        if (!this._showToastButton) {
            this._showToastButton = new ButtonComponent(this.page, 'button:has-text("Show toast")');
        }
        return this._showToastButton;
    }

    private get randomToastButton(): ButtonComponent {
        if (!this._randomToastButton) {
            this._randomToastButton = new ButtonComponent(this.page, 'button:has-text("Random toast")');
        }
        return this._randomToastButton;
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
        await this.destroyByClickCheckbox.uncheckByLabel('Hide on click')
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
        await this.showToastButton.clickButtonByText('Show toast'); // Use component
    }

    async clickRandomToastButton() {
        await this.randomToastButton.clickButtonByText('Random toast'); //Use component
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