export interface MenuItem {
  title: string;
  icon?: string;
  link?: string;
  home?: boolean;
  group?: boolean;
  children?: MenuItem[];
}

export const MENU_ITEMS: MenuItem[] = [
  {
    title: 'IoT Dashboard',
    icon: 'home',
    link: '/pages/iot-dashboard',
  },
  {
    title: 'FEATURES',
    group: true,
  },
  {
    title: 'Forms',
    icon: 'edit',
    children: [
      {
        title: 'Form Layouts',
        link: '/pages/forms/layouts',
      },
      {
        title: 'Datepicker',
        link: '/pages/forms/datepicker',
      },
    ],
  },
  {
    title: 'Modal & Overlays',
    icon: 'web',
    children: [
      {
        title: 'Dialog',
        link: '/pages/modal-overlays/dialog',
      },
      {
        title: 'Window',
        link: '/pages/modal-overlays/window',
      },
      {
        title: 'Popover',
        link: '/pages/modal-overlays/popover',
      },
      {
        title: 'Toastr',
        link: '/pages/modal-overlays/toastr',
      },
      {
        title: 'Tooltip',
        link: '/pages/modal-overlays/tooltip',
      },
    ],
  },
  {
    title: 'Extra Components',
    icon: 'message',
    children: [
      {
        title: 'Calendar',
        link: '/pages/extra-components/calendar',
      },
    ],
  },
  {
    title: 'Charts',
    icon: 'pie_chart',
    children: [
      {
        title: 'Echarts',
        link: '/pages/charts/echarts',
      },
    ],
  },
  {
    title: 'Tables & Data',
    icon: 'grid_on',
    children: [
      {
        title: 'Smart Table',
        link: '/pages/tables/smart-table',
      },
      {
        title: 'Tree Grid',
        link: '/pages/tables/tree-grid',
      },
    ],
  },
  {
    title: 'Auth',
    icon: 'lock',
    children: [
      {
        title: 'Login',
        link: '/auth/login',
      },
      {
        title: 'Register',
        link: '/auth/register',
      },
      {
        title: 'Request Password',
        link: '/auth/request-password',
      },
      {
        title: 'Reset Password',
        link: '/auth/reset-password',
      },
    ],
  },
];
