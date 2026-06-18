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