import type { StrapiApp } from '@strapi/strapi/admin';

export default {
  config: {
    translations: {
      en: {
        'Auth.form.welcome.title': 'Welcome to Vietsure English',
        'Auth.form.welcome.subtitle': 'Log in to your administrator account to continue',
      }
    },
    locales: ['en'],
  },

  bootstrap(app: StrapiApp) {
    console.log(app);

    // Thêm tab Lịch Dạy vào sidebar
    app.addMenuLink({
      to: '/schedule',
      icon: () => '📅',
      intlLabel: {
        id: 'schedule.label',
        defaultMessage: 'Teaching Schedule',
      },
      Component: async () => {
        const { default: SchedulePage } = await import('../extensions/schedule');
        return { default: SchedulePage };
      },
      permissions: [],
    });

    // Thêm tab Quản lý Bản ghi vào sidebar
    app.addMenuLink({
      to: '/class-record',
      icon: () => '📹',
      intlLabel: {
        id: 'class-record.label',
        defaultMessage: 'Class Recordings',
      },
      Component: async () => {
        const { default: ClassRecordPage } = await import('../extensions/class-record');
        return { default: ClassRecordPage };
      },
      permissions: [],
    });
  },

  register(app: StrapiApp) {
    const indexRoute = app.router.routes.find(({ index }) => index);
    if (!indexRoute) throw new Error('unable to find index page');

    indexRoute.lazy = async () => {
      const { Homepage } = await import('./pages/HomePage');
      return { Component: Homepage };
    };
  },
};