import { CdkOverlayOrigin, ConnectedPosition } from '@angular/cdk/overlay';
import { Component, HostListener, TemplateRef, Type } from '@angular/core';
import {
  NgxPopoverCardComponent, NgxPopoverFormComponent,
  NgxPopoverTabsComponent,
} from './popover-examples.component';

type PopoverTrigger = 'click' | 'hover' | 'hint';
type PopoverPlacement = 'top' | 'right' | 'bottom' | 'left';
type PopoverStatus = 'default' | 'primary' | 'success' | 'warning' | 'danger';

interface PopoverContent {
  kind: 'text' | 'template' | 'component';
  text?: string;
  template?: TemplateRef<unknown>;
  component?: Type<unknown>;
}

interface ActivePopover {
  id: string;
  origin: CdkOverlayOrigin;
  placement: PopoverPlacement;
  trigger: PopoverTrigger;
  status: PopoverStatus;
  content: PopoverContent;
}

interface PlacementButton {
  id: string;
  label: string;
  placement: PopoverPlacement;
}

interface TextPopoverButton {
  id: string;
  label: string;
  trigger: PopoverTrigger;
  status: PopoverStatus;
}

const POPOVER_POSITIONS: Record<PopoverPlacement, ConnectedPosition[]> = {
  top: [
    { originX: 'center', originY: 'top', overlayX: 'center', overlayY: 'bottom', offsetY: -12 },
    { originX: 'center', originY: 'bottom', overlayX: 'center', overlayY: 'top', offsetY: 12 },
    { originX: 'end', originY: 'center', overlayX: 'start', overlayY: 'center', offsetX: 12 },
    { originX: 'start', originY: 'center', overlayX: 'end', overlayY: 'center', offsetX: -12 },
  ],
  right: [
    { originX: 'end', originY: 'center', overlayX: 'start', overlayY: 'center', offsetX: 12 },
    { originX: 'start', originY: 'center', overlayX: 'end', overlayY: 'center', offsetX: -12 },
    { originX: 'center', originY: 'bottom', overlayX: 'center', overlayY: 'top', offsetY: 12 },
    { originX: 'center', originY: 'top', overlayX: 'center', overlayY: 'bottom', offsetY: -12 },
  ],
  bottom: [
    { originX: 'center', originY: 'bottom', overlayX: 'center', overlayY: 'top', offsetY: 12 },
    { originX: 'center', originY: 'top', overlayX: 'center', overlayY: 'bottom', offsetY: -12 },
    { originX: 'end', originY: 'center', overlayX: 'start', overlayY: 'center', offsetX: 12 },
    { originX: 'start', originY: 'center', overlayX: 'end', overlayY: 'center', offsetX: -12 },
  ],
  left: [
    { originX: 'start', originY: 'center', overlayX: 'end', overlayY: 'center', offsetX: -12 },
    { originX: 'end', originY: 'center', overlayX: 'start', overlayY: 'center', offsetX: 12 },
    { originX: 'center', originY: 'bottom', overlayX: 'center', overlayY: 'top', offsetY: 12 },
    { originX: 'center', originY: 'top', overlayX: 'center', overlayY: 'bottom', offsetY: -12 },
  ],
};

@Component({
  selector: 'ngx-popovers',
  styleUrls: ['./popovers.component.scss'],
  templateUrl: './popovers.component.html',
  standalone: false
})
export class PopoversComponent {
  readonly simpleText = 'Hello, how are you today?';
  readonly placementButtons: PlacementButton[] = [
    { id: 'left', label: 'Left', placement: 'left' },
    { id: 'top', label: 'Top', placement: 'top' },
    { id: 'bottom', label: 'Bottom', placement: 'bottom' },
    { id: 'right', label: 'Right', placement: 'right' },
  ];
  readonly simpleButtons: TextPopoverButton[] = [
    { id: 'click', label: 'on click', trigger: 'click', status: 'success' },
    { id: 'hover', label: 'on hover', trigger: 'hover', status: 'success' },
    { id: 'hint', label: 'on hint', trigger: 'hint', status: 'success' },
  ];
  readonly debounceButtons = Array.from({ length: 16 }, (_, index) => `hint-${index + 1}`);

  tabsComponent = NgxPopoverTabsComponent;
  cardComponent = NgxPopoverCardComponent;
  formComponent = NgxPopoverFormComponent;

  activePopover: ActivePopover | null = null;

  private openTimer: ReturnType<typeof setTimeout> | null = null;
  private closeTimer: ReturnType<typeof setTimeout> | null = null;

  get isPopoverOpen(): boolean {
    return this.activePopover !== null;
  }

  get activeOrigin(): CdkOverlayOrigin | undefined {
    return this.activePopover?.origin;
  }

  get activePositions(): ConnectedPosition[] {
    return POPOVER_POSITIONS[this.activePopover?.placement ?? 'top'];
  }

  get activeTrigger(): PopoverTrigger | null {
    return this.activePopover?.trigger ?? null;
  }

  get activeStatusClass(): string {
    return `app-popover-panel--${this.activePopover?.status ?? 'default'}`;
  }

  get activeText(): string | null {
    return this.activePopover?.content.kind === 'text'
      ? this.activePopover.content.text ?? ''
      : null;
  }

  get activeTemplate(): TemplateRef<unknown> | null {
    return this.activePopover?.content.kind === 'template'
      ? this.activePopover.content.template ?? null
      : null;
  }

  get activeComponent(): Type<unknown> | null {
    return this.activePopover?.content.kind === 'component'
      ? this.activePopover.content.component ?? null
      : null;
  }

  onPositionEnter(origin: CdkOverlayOrigin, placement: PopoverPlacement, id: string): void {
    this.schedulePopover({
      id,
      origin,
      placement,
      trigger: 'hint',
      status: 'danger',
      content: { kind: 'text', text: this.simpleText },
    });
  }

  onTextButtonClick(button: TextPopoverButton, origin: CdkOverlayOrigin): void {
    if (button.trigger !== 'click') {
      return;
    }

    this.togglePopover({
      id: button.id,
      origin,
      placement: 'bottom',
      trigger: button.trigger,
      status: button.status,
      content: { kind: 'text', text: this.simpleText },
    });
  }

  onTextButtonEnter(button: TextPopoverButton, origin: CdkOverlayOrigin): void {
    if (button.trigger === 'click') {
      return;
    }

    this.schedulePopover({
      id: button.id,
      origin,
      placement: 'bottom',
      trigger: button.trigger,
      status: button.status,
      content: { kind: 'text', text: this.simpleText },
    });
  }

  onTemplateButtonClick(id: string, origin: CdkOverlayOrigin, template: TemplateRef<unknown>): void {
    this.togglePopover({
      id,
      origin,
      placement: 'bottom',
      trigger: 'click',
      status: 'warning',
      content: { kind: 'template', template },
    });
  }

  onComponentButtonClick(id: string, origin: CdkOverlayOrigin, component: Type<unknown>): void {
    this.togglePopover({
      id,
      origin,
      placement: 'bottom',
      trigger: 'click',
      status: 'warning',
      content: { kind: 'component', component },
    });
  }

  onDebounceEnter(origin: CdkOverlayOrigin, id: string): void {
    this.schedulePopover({
      id,
      origin,
      placement: 'top',
      trigger: 'hint',
      status: 'default',
      content: { kind: 'text', text: 'Popover!' },
    });
  }

  onTriggerLeave(trigger: PopoverTrigger = 'hint'): void {
    if (trigger !== 'click') {
      this.scheduleClose();
    }
  }

  cancelClose(): void {
    if (this.closeTimer) {
      clearTimeout(this.closeTimer);
      this.closeTimer = null;
    }
  }

  onPanelMouseLeave(): void {
    if (this.activeTrigger !== 'click') {
      this.scheduleClose();
    }
  }

  closePopover(): void {
    this.cancelClose();
    this.clearOpenTimer();
    this.activePopover = null;
  }

  onOverlayDetached(): void {
    this.cancelClose();
    this.clearOpenTimer();
    this.activePopover = null;
  }

  @HostListener('document:keydown.escape')
  handleEscape(): void {
    this.closePopover();
  }

  @HostListener('window:resize')
  handleViewportChange(): void {
    if (this.isPopoverOpen) {
      this.closePopover();
    }
  }

  private togglePopover(popover: ActivePopover): void {
    if (this.activePopover?.id === popover.id && popover.trigger === 'click') {
      this.closePopover();
      return;
    }

    this.clearOpenTimer();
    this.cancelClose();
    this.activePopover = popover;
  }

  private schedulePopover(popover: ActivePopover): void {
    this.clearOpenTimer();
    this.cancelClose();

    const delay = popover.trigger === 'hint' ? 90 : 0;
    if (delay === 0) {
      this.activePopover = popover;
      return;
    }

    this.openTimer = setTimeout(() => {
      this.activePopover = popover;
      this.openTimer = null;
    }, delay);
  }

  private scheduleClose(): void {
    this.cancelClose();
    this.closeTimer = setTimeout(() => {
      this.activePopover = null;
      this.closeTimer = null;
    }, 110);
  }

  private clearOpenTimer(): void {
    if (this.openTimer) {
      clearTimeout(this.openTimer);
      this.openTimer = null;
    }
  }
}
