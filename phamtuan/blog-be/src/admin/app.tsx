import type { StrapiApp } from '@strapi/strapi/admin';

export default {
  config: {
    locales: [
      // 'ar',
      // 'fr',
      // 'cs',
      // 'de',
      // 'dk',
      // 'es',
      // 'he',
      // 'id',
      // 'it',
      // 'ja',
      // 'ko',
      // 'ms',
      // 'nl',
      // 'no',
      // 'pl',
      // 'pt-BR',
      // 'pt',
      // 'ru',
      // 'sk',
      // 'sv',
      // 'th',
      // 'tr',
      // 'uk',
      // 'vi',
      // 'zh-Hans',
      // 'zh',
    ],
  },
   bootstrap(app: StrapiApp) {
    console.log(app);
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
