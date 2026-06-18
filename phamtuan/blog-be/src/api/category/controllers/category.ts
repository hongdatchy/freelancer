/**
 * category controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::category.category', {
  async count(ctx) {
    const { locale } = ctx.query;
    const defaultLocale = strapi.config.get('plugin.i18n.defaultLocale', 'en');
    const categories = await strapi.db.query('api::category.category')
    .findMany({
      where: {
        published_at: { $notNull: true },
        locale: locale || defaultLocale, 
      },
      populate: {
        posts: 
        {
          select: ['id'],
        },
      },
    });
    return categories;
  }
});

