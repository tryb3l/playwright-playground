import { Component } from '@angular/core';
import { TooltipPosition } from '@angular/material/tooltip';

type TooltipStatus = 'default' | 'primary' | 'success' | 'danger' | 'info' | 'warning';

interface TooltipButton {
    id: string;
    label: string;
    message: string;
    position: TooltipPosition;
    status: TooltipStatus;
    iconClass?: string;
}

@Component({
    selector: 'ngx-tooltip',
    templateUrl: 'tooltip.component.html',
    styleUrls: ['tooltip.component.scss'],
    standalone: false
})
export class TooltipComponent {
    readonly iconButtons: TooltipButton[] = [
        {
            id: 'tooltip-icon-default',
            label: 'Show Tooltip',
            message: 'This is a tooltip',
            position: 'above',
            status: 'default',
            iconClass: 'fa-house',
        },
        {
            id: 'tooltip-icon-danger',
            label: 'Show Tooltip',
            message: 'Danger state tooltip',
            position: 'above',
            status: 'danger',
            iconClass: 'fa-triangle-exclamation',
        },
    ];

    readonly placementButtons: TooltipButton[] = [
        { id: 'tooltip-top', label: 'Top', message: 'This is a tooltip', position: 'above', status: 'default' },
        { id: 'tooltip-right', label: 'Right', message: 'This is a tooltip', position: 'right', status: 'default' },
        { id: 'tooltip-bottom', label: 'Bottom', message: 'This is a tooltip', position: 'below', status: 'default' },
        { id: 'tooltip-left', label: 'Left', message: 'This is a tooltip', position: 'left', status: 'default' },
    ];

    readonly colorButtons: TooltipButton[] = [
        { id: 'tooltip-default', label: 'Default', message: 'This is a tooltip', position: 'above', status: 'default' },
        { id: 'tooltip-primary', label: 'Primary', message: 'This is a tooltip', position: 'above', status: 'primary' },
        { id: 'tooltip-success', label: 'Success', message: 'This is a tooltip', position: 'above', status: 'success' },
        { id: 'tooltip-danger', label: 'Danger', message: 'This is a tooltip', position: 'above', status: 'danger' },
        { id: 'tooltip-info', label: 'Info', message: 'This is a tooltip', position: 'above', status: 'info' },
        { id: 'tooltip-warning', label: 'Warning', message: 'This is a tooltip', position: 'above', status: 'warning' },
    ];

    getTooltipClasses(status: TooltipStatus): string[] {
        return ['app-tooltip-panel', `app-tooltip-panel--${status}`];
    }
}
